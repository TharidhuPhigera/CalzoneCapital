# Financial Investment Assistant


## Introduction

Calzone Capital is a sophisticated financial investment assistant platform, leveraging cutting-edge web technologies and machine learning for effective stock market analysis and predictions. The project utilizes NextJS for the frontend and Python Flask for backend operations, integrating complex predictive models with a robust, user-friendly interface.

### Prerequisites

To run this project, you will need Node.js and Python installed on your machine. The project is split into two main parts:

*     Frontend: Located in the **/calzone-capital** directory, built with NextJS.
*     Backend: Located in the **/calzone-python** directory, powered by Python Flask. For Apple Silicon Mac users, using a Conda environment is recommended to ensure compatibility.

### Key Dependencies

*     NextJS Libraries:
	*         **@next/font**, **@heroicons/react**, and styled-components for UI styling and iconography.
	*         **axios** for making HTTP requests.
	*         **next-auth** for handling authentication.
	*         **socket.io-client** for real-time web socket communications.
*     Python Libraries:
	*         **Flask** and **flask_cors** for server setup and handling CORS.
	*         **keras** with **LSTM** for building neural network models essential for stock price prediction.
	*         **sklearn** for data preprocessing and evaluation metrics.
	*         **pandas** and **numpy** for data manipulation and numerical operations.

### Database

The project utilises MongoDB for data storage. Ensure that MongoDB is running when deploying the project. Access credentials may be necessary, depending on your configuration.

##### Access Credentials

For simplicity and to facilitate your access to the project's MongoDB database, custom access credentials have been configured. These credentials should be used to connect to the database through your MongoDB client or within application code that requires database access.

Here is the connection string template you should use:

	mongodb+srv://<username>:<password>@<cluster-address>/<dbname>?retryWrites=true&w=majority

Replace the placeholders with the following details to connect:

*    **username**: supervisor
*     **password**: 9KA6zgDE4WQaxHIG
*     **cluster-address**: cluster0.s8fqejr.mongodb.net
*     **dbname**: CalzoneCapital

**Important Note**: The credentials provided above are included in the project's source code for ease of setup and are intended for use in a controlled development environment. 



### Using Financial APIs

Calzone Capital relies extensively on financial data provided by Twelve Data and Finnhub APIs. Documentation for these APIs can be accessed at:

* Twelve Data: [API Documentation](https://twelvedata.com/docs#reference-data)
* Finnhub: [API Documentation](https://finnhub.io/docs/api)

You may need to sign up to obtain an API key from these services. For ease of use, the API keys have been included in the project's code.

## Installation Steps

##### 1. Clone the Repository
Begin by cloning the repository to your local machine using Git:

   	git clone [Repository URL]

##### 2. Install Frontend Dependencies
Navigate to the **/calzone-capital** directory and install the required Node.js dependencies:


	cd calzone-capital
	npm install

##### 3. Set Up Python Environment
Depending on your system, set up the Python environment:

###### Apple Silicon Macs:

	conda create --name calzone python=3.8
	conda activate calzone
	conda install -c apple tensorflow-macos


###### Other Systems:

    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`


Ensure you navigate to the /calzone-python directory before installing Python dependencies:


    cd calzone-python

## Running the Application

#####  1. Run the NextJS Frontend
   Start the NextJS application by running the following command in the **/calzone-capital** directory:

	npm run dev

This command serves the frontend on http://localhost:3000.

##### 2. Run Python Backend Scripts
In the **/calzone-python** directory, you need to run both backend scripts to fully activate all backend functionalities:

###### Run User Management Script:

	python user.py

###### Run Prediction Model Script:


    python predictor.py

It's essential to run both user.py for handling user data and session management and predictor.py for stock prediction functionalities.



