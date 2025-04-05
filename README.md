# **CRM Project Setup Guide**  

## **1. Create and Activate Virtual Environment**  
Run the following command to create a virtual environment:  
```bash
python -m venv venv
```  

To activate the virtual environment:  
- **Windows:**  
  ```bash
  venv\Scripts\activate
  ```  
- **Linux/Mac:**  
  ```bash
  source venv/bin/activate
  ```  

---

## **2. Backend Setup (Django)**  
Navigate to the `crm_backend` directory and install dependencies:  
```bash
pip install -r requirements.txt
```  

To start the Django server:  
```bash
python manage.py runserver
```  

---

## **3. Frontend Setup (React) (In a different terminal)**  
Navigate to the `frontend` directory:  
```bash
cd frontend
```  
Install dependencies:  
```bash
npm install
```  
To run the React development server:  
```bash
npm start
```  
# **NOTE:**  
Create a ```.gitignore``` file and add the following list into it:  
.gitignore  
venv/  
.env  
__pycache__/  
*.pyc  


