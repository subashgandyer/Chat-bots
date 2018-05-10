# Chat-bots
This repo contains code for creating an intelligent chat bot. This takes in Analyzed sentiments from the restaurant reviews published by users and builds a table of Top dishes in a restaurant, Top restaurants in a cuisine, Top restaurants in an area, Top dishes in a cuisine and so on. These top x's will be sent to the chat user as and when it is required in the conversation. 

Sample Screenshot of the chat bot

![chat bot screenshot](https://user-images.githubusercontent.com/8546369/39764638-0ef3e8d4-52ae-11e8-8f1d-e85a3aeab999.png)


## Objective
The objective of this project is to build a Chatbot for Restaurants to interact and find Top-k dishes of every restaurant in a city with its popularity index and also get recommendations of top dishes to customers depending on their cuisine and taste preferences.

## Description
Python scripts for scraping reviews from Zomato, foursquare and yelp are written. Reviews are cleaned, pre-processed and explored for patterns. Machine learning model is built with the best features for discriminating positive and negative sentiments in the reviews. The built model is optimized for generalization and accuracy. The optimized model is then validated and evaluated. A bot is created by taking into account various scenarios of the customers’ interactions. Using Facebook’s wit.ai, entities are identified in the chat and actions are taken accordingly. 

## Inout & Output

Input  : Sentiments and Top-k dishes from Sentiment Analyzer

Output : Interactive intelligent bot that answers questions on restaurants in a city about Top-k dishes 

## Tools Used
* NodeJS
* wit.ai
* heroku

## Important Files

index.js -- Chat bot using wit.ai

/templates -- Files used for creating an Online Ordering Client Application

