from flask import Flask, request, jsonify, abort, make_response, g
import mysql.connector, mysql.connector.pooling
import json
import uuid
import bcrypt

pool = mysql.connector.pooling.MySQLConnectionPool(
    host = "blog-db-rds.cmvolhiqejy7.us-east-1.rds.amazonaws.com", #localhost
    user = "admin", #root
    passwd = "dbpwddbpwd", #dbpwd
    database = "blog_db",
	buffered = True,
	pool_size = 10
)

app = Flask(__name__,
            static_folder='../Frontend/build',
            static_url_path='/')

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.before_request
def before_request():
	g.db = pool.get_connection()

@app.teardown_request
def teardown_request(exception):
	g.db.close()

@app.route("/api/alive")
def alive():
    return "alive"

@app.route('/login', methods=['POST', 'GET'])
def login():
	data = request.get_json()
	query = "select id, password, first_name, email, role from users where username = %s"
	values = (data['username'], )
	cursor = g.db.cursor()
	cursor.execute(query, values)
	record = cursor.fetchone()
	if not record:
		abort(401)
	user_id, first_name, email, role = record[0], record[2], record[3], record[4]
	hashed_pwd = record[1].encode('utf-8')
	if bcrypt.hashpw(data['password'].encode('utf-8'), hashed_pwd) != hashed_pwd:
		abort(401)
	session_id = str(uuid.uuid4())
	query = "insert into sessions (user_id, session_id) values (%s, %s) on duplicate key update session_id=%s"
	values = (user_id, session_id, session_id)
	cursor.execute(query, values)
	g.db.commit()
	user_data = {"user_id": user_id, "first_name": first_name, "email": email, "role": role}
	resp = make_response(user_data)
	resp.set_cookie("session_id", session_id)
	return resp

@app.route('/logout', methods=['POST'])
def logout():
	data = request.get_json()
	query = "delete from sessions where user_id=%s"
	value = (data['user_id'],)
	cursor = g.db.cursor()
	cursor.execute(query, value)
	g.db.commit()
	cursor.close()
	resp = make_response()
	resp.set_cookie("session_id", '', expires=0)
	return resp

@app.route('/user', methods=['GET'])
def user():
    session_id = request.cookies.get("session_id")
    if session_id is None:
        abort(401)
    query = "select id, first_name, email, role from users inner join sessions on users.id=sessions.user_id where sessions.session_id=%s"
    cursor = g.db.cursor()
    value = (session_id,)
    cursor.execute(query, value)
    records = cursor.fetchall()
    header = ['user_id', 'first_name', 'email', 'role']
    data = dict(zip(header,records[0]))
    user_data = json.dumps(data, default=str)
    print(user_data)
    return user_data


@app.route('/register', methods=['POST'])
def register():
	data = request.get_json()
	print(data)
	query = "select id from users where username = (%s)"
	value = (data['username'], )
	cursor = g.db.cursor()
	cursor.execute(query, value)
	records = cursor.fetchall()
	print(records)
	if records:
		abort(401)
	hashed_pwd = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
	query = "insert into users (first_name, last_name, email, username, password) values (%s, %s, %s, %s, %s)"
	values = (data['firstName'], data['lastName'], data['email'], data['username'], hashed_pwd)
	cursor.execute(query, values)
	g.db.commit()
	new_user_id = cursor.lastrowid
	cursor.close()
	return 'New user id: ' + str(new_user_id)

@app.route('/posts', methods=['GET', 'POST'])

def manage_posts_requests():
    if request.method == 'GET':
        return get_all_posts()
    else:
    	return add_post()

def add_post():
	data = request.get_json()
	query = "insert into posts (title, content, author) values (%s, %s, %s)"
	values = (data['title'], data['content'], data['author'])
	cursor = g.db.cursor()
	cursor.execute(query, values)
	g.db.commit()
	new_post_id = cursor.lastrowid
	cursor.close()
	return 'New post id: ' + str(new_post_id)


def get_all_posts():
	query = "select id, title, content, author, published_at from posts"
	data = []
	cursor = g.db.cursor()
	cursor.execute(query)
	records = cursor.fetchall()
	header = ['id', 'title', 'content', 'author', 'published_at']
	for r in records:
		data.append(dict(zip(header, r)))
	cursor.close()
	return json.dumps(data, default=str)
     

@app.route('/posts/<id>')

def get_post_and_comments_by_ID(id):
    query = "select id, title, content, author, published_at from posts where id=%s"
    value =(id,)
    cursor = g.db.cursor()
    cursor.execute(query,value)
    records = cursor.fetchall()
    header = ['id', 'title', 'content', 'author', 'published_at']
    post_json = dict(zip(header,records[0]))
    #print(post_json)
    
    query = "select comment, author, published_at from comments where post_id=%s"
    cursor.execute(query, value)
    records = cursor.fetchall()
    header = ['comment', 'author', 'published_at']
    comments = []
    for r in records:
	    comments.append(dict(zip(header, r)))
    cursor.close()
    post_json["comments"] = comments
    post_json = json.dumps(post_json, default=str)
    
    
    return post_json
    

@app.route('/comments', methods=['POST'])

def add_comment():
    data = request.get_json()
    query = "insert into comments (post_id, comment, author) values (%s, %s, %s)"
    values = (data['post_id'], data['comment'], data['author'])
    cursor = g.db.cursor()
    cursor.execute(query, values)
    g.db.commit()
    new_comment_id = cursor.lastrowid
    value = (new_comment_id,)
    query = "select comment, author, published_at from comments where id=%s"
    cursor.execute(query, value)
    records = cursor.fetchall()
    cursor.close()
    header = ['comment', 'author', 'published_at']
    comment = dict(zip(header,records[0]))
    comment_json = json.dumps(comment, default=str)
    return comment_json

@app.route('/delete', methods=['POST'])

def delete_post():
	data = request.get_json()
	print(data)
	query = "delete from posts where id=%s"
	values = (data['id'],)
	cursor = g.db.cursor()
	cursor.execute(query,values)
	g.db.commit()
	cursor.close()
	data = get_all_posts()
	return data


@app.route('/edit', methods=['POST'])

def edit_post():
    data = request.get_json()
    query = "update posts set title=%s, content=%s, author=%s where id=%s"
    values = (data['title'], data['content'], data['author'], data['id'])
    cursor = g.db.cursor()
    cursor.execute(query, values)
    g.db.commit()
    cursor.close()
    return 'updated'
	



if __name__ == "__main__":
	app.run()