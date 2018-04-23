from flask import Flask,render_template
#from restaurants import get_restaurants

#RESTAURANTS = get_restaurants()

appl = Flask(__name__)

@appl.route('/')
def homepage():
	return render_template("{{ url_for('templates',filename='index.html') }}")
	#return 'Hi'
	#return render_template("index.html")

# @appl.route('/restaurants')
# def getrestaurants():

# 	return render_template('restaurants.html',RESTAURANTS=RESTAURANTS)



if __name__ == '__main__':
	appl.run()