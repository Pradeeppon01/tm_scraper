from flask import Flask,request
import json
from flask_cors import CORS
from bs4 import BeautifulSoup 
import pprint
import os
import shutil
from datetime import datetime 

app=Flask(__name__)
CORS(app, origins="https://neuustore.com")
pp=pprint.PrettyPrinter(indent=4)
dir_name="content"


@app.route('/scarpDataFromHtml',methods=["POST","GET"])
def scrapDataFromHtml():
    print("Into the function of scarp Data from html")
    try:
        data=json.loads(request.data)
        body=data.get("body")
        print("After body")
        soup=BeautifulSoup(body,'html.parser')
        table=soup.find("table")
        print("After table : ",table)
        table_head=table.find("thead")
        table_rows=table_head.find_all("tr")
        data_row=table_rows[0]
        print("After tr",data_row)
        th_data=data_row.find_all("th")
        headers=[]
        for th in th_data:
            headers.append(th.get_text())
        print("Headers ======== ",headers)
        table_body=table.find("tbody")
        x=datetime.now()
        timestamp=x.strftime("%Y-%m-%d_%H:%M:%S")
        file_name="{}.txt".format(timestamp)
        table_body.save(os.path.join(os.getcwd(),dir_name,file_name))
        table_rows=table_body.find_all("tr")
        json_data=[]
        headers_length=len(headers)
        for row in table_rows:
            table_data=row.find_all("td")
            values=[]
            for data in table_data:
                values.append(data.get_text())
            json_=dict(zip(headers,values))
            json_data.append(json_)
        print("JSON Data ======== ",json_data)
        response_data={"message":"API successfull","status":"success"}
        return response_data
    except Exception as e:
        print("Error occured in the scrap Data from html ",e)
        response_data={"message":f"Error : {e}","status":"error"}
        return response_data



@app.route('/saveUrl',methods=["POST","GET"])
def saveUrl():
    print("Into the function of save url")
    try:
#        data=json.loads(request.data)
#        url=data.get("url")
#        timestamp=datetime.now()
#        timestring=timestamp.strftime("%Y:%m%d_%H:%M:%s")
#        filename=f"{timestring}.txt"
#        print("Filename is : ",filename)
#        cw_path=os.getcwd()
#        file_path=os.path.join(cw_path,"content",filename)
#        f=open(file_path,'w')
#        f.write(url)
        files=request.files
        print("files is : ",files)
        screenshot=request.files['screenshot']
        timestamp=datetime.now()
        timestring=timestamp.strftime("%Y:%m%d_%H:%M:%s")
        filename=f"{timestring}.png"
        print("Filename is : ",filename)
        cw_path=os.getcwd()
        file_path=os.path.join(cw_path,"content",filename)
        screenshot.save(file_path)
        response_data={"message":"API successfull","status":"success"}
        return response_data
    except Exception as e:
        print("Error in the save url : ",e)
        response_data={"message":f"Error : {e}","status":"error"}
        return response_data


if __name__=="__main__":
    app.run(port="11111",host="0.0.0.0",debug=True)
