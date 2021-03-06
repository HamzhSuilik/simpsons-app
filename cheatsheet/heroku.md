# Steps to Deploy to Heroku with a Postgres Database

Step 1: create a new app on Heroku
- Either in the command line or in at heroku.com, create a new app
- Connect it to your GitHub repo
- Enable automatic deployment

Step 2: Go to the ‘resources’ tab

Step 3: Search for Heroku Postgresql
- Add the free version

Step 4: Go to the settings tab
- Click on the ‘reveal config vars’
- You should see a config variable called DATABASE_URL with some postgres url that Heroku is giving you
- Add PGSSLMODE and set it to no-verify

Step 5: In your terminal, run your schema on your Heroku database by doing the following:
- Navigate to where your schema file lives
- Type in the following command:

> `heroku pg:psql -f schema.sql --app HEROKU_APP_NAME_HERE`

Step 6: Continue app development
- Your Heroku database is running in the cloud. It's schema and data are not connected to your development environment. 
- If you change your schema locally, you will also need to make the same change in the production environment (your Heroku app). 

That's it! Enjoy your Heroku app with a database.
