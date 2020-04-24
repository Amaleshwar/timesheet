import React from 'react';
import logo from './logo.svg';
import ExcelViewExport from './ExcelViewExport.js'; 
import './App.css';

import DataGrid from './DataGrid.js'; 
import axios from 'axios';
// import Select, { components } from 'react-select';
// import makeAnimated from 'react-select/animated';


import { Multiselect } from 'multiselect-react-dropdown';


// import MultiSelect from "react-multi-select-component";


// var json =[{
    
// "SNO" : 1,
// "EmployeeName" : "Chai",
// "Week1TaskName" : 1,
// "Week1Totalhours" : 1,
// "Week2TaskName" : 1,
// "Week2Totalhours" : 1,
// "Week3TaskName" : 1,
// "Week3Totalhours" : 1,
// "Week4TaskName" : 1,
// "Week4Totalhours" : 1,
// "1" : 1,
// "2" : 1
    
// }, {
    
// "SNO" : 1,
// "EmployeeName" : "Chai",
// "Week1TaskName" : 1,
// "Week1Totalhours" : 1,
// "Week2TaskName" : 1,
// "Week2Totalhours" : 1,
// "Week3TaskName" : 1,
// "Week3Totalhours" : 1,
// "Week4TaskName" : 1,
// "Week4Totalhours" : 1,
// "1" : 1,
// "2" : 1
// }];
var json =[
];
var fs = require('fs');



  class App extends React.Component  {
    constructor(props) {
      super(props);
      this.state = {  jsondata: [],
        header:[],
        presentweektext:'',
        presentweek:[],
        presentweekno:0,
        selectoptions:[],
        optionSelected:[],
        selected:null,
        activityname:'',
        empname:'',
        employeelist:   ['amal','raj']   ,   
        holidaystoggle: false,  
        filename:'',
       }

       this.style={ chips: { background: "red" }, searchBox: { border: "none", "border-bottom": "1px solid blue", "border-radius": "0px" }}
 
         
  }
    

    componentDidMount(){
      var empnames=this.state.employeelist;
      var  date = new Date();
      var   persentYear = date.getFullYear();
      var persentMonth = date.getMonth();
      var persentDate = date.getDate();     
      console.log("persentDate",persentDate);
      var firstDate = new Date(persentYear, persentMonth, 1);
      var lastDate = new Date(persentYear, persentMonth + 1, 0);
      var numDays = lastDate.getDate();
      console.log("firstdgetFullYearay",persentYear,"||| getMonth",persentMonth,date);
      var weeks=  this.getWeeksStartAndEndInMonth('monday',firstDate,numDays);
      console.log("res",weeks);
      var weekends=  this.getWeekendsInMonth(persentYear,persentMonth,numDays);
      console.log("res",weekends);

  
var filename = persentYear+''+persentMonth;
console.log(filename)

   // file check
  // 
let filecehckformdata =new FormData();
filecehckformdata.append('filename',filename);
axios.post("http://localhost:8002/checkfileexists",filecehckformdata)
  .then(res=>{  
                var fileexisits = res.data;
                  console.log("status data",fileexisits);
   
    console.log("file exists: ",fileexisits)
    if(!fileexisits){
       //  create json 
       for(var i=0; i<empnames.length;i++){
        // var emplist={};
        var  employee = {}
         employee ["sno"] = i;
         employee ["EmployeeName"] = empnames[i];
   
         for(var j=1; j<=weeks.length;j++){
           employee [`Week${j}TaskName`] = 0;
           employee [`Week${j}Totalhours`] = 0;
         }
         for(var x=1; x<=numDays;x++){
           employee [`day${x}`] = 0;    //  days coloumn name
         }
        // emplist[empnames[i]] = employee
         json.push(employee)
       }

        var result;
      let formdata =new FormData();  
    formdata.append('filename',filename);
    formdata.append('jsondata',JSON.stringify(json));
    axios.post("http://localhost:8002/createjsonfile",formdata)
        .then(res=>{  
          result=   res.data;
          console.log("status text",res.statusText);

        })
   
  
 }else{
var presentweektext =''; 
var presentweek =[];
var presentweekno=0;

  weeks.map((week,i)=>{ if(week.start<= persentDate && week.end>= persentDate){
   // console.log(week,"week ",i+1); 
   presentweekno = i+1;
   presentweektext = "week "+ (i+1) +" : ["+(week.start) + " to "+ (week.end)+"]"  ;
   for(var i=week.start; i<=week.end;i++ ) {    presentweek.push(i) }

   // console.log("presentweek is :",presentweek); 
  }
  })


  let formdata =new FormData();  
  formdata.append('filename',filename);
  axios.post("http://localhost:8002/getjsondata",formdata)
      .then(res=>{  
        result=   res.data;
        console.log("status text",res.data);
        // result =JSON.parse(res.data)
       console.log("keys :", Object.keys(result[0]))
      var options= presentweek.map((key, index) => {
       //  return            { label: key , value: key } })     
       return            { name: key.toString() , id: key ,  }  })  
       var presentweekends=[];
        options.filter((day)=>{    // console.log(day.id)
         weekends.map((weekend)=>{ 
           if(weekend===day.id) { console.log(weekend); presentweekends.push(day) } 
           
          })
           
        
         

       })
       console.log("weekends in present week :",presentweekends)
     
     console.log("options : ",options)
        this.setState({filename:filename,jsondata:result,header:Object.keys(result[0]),presentweek:presentweek,presentweektext:presentweektext,selectoptions:options,selected:presentweekends,presentweekno:presentweekno});
        //console.log("options : ",options)
      })
 }

  })



   
    }
  

  

    getWeekendsInMonth = function(persentYear,persentMonth,numDays) {
      let weekends = [];
   //  for(var i=1 ; i>=numDays; i++){
    for(var i=1;i<=numDays;i++){    //looping through days in month
      var newDate = new Date(persentYear,persentMonth,i)
      if(newDate.getDay()==0){   //if Sunday
        weekends.push(i);
      }
      if(newDate.getDay()==6){   //if Saturday
        weekends.push(i);
      }
     }
      return weekends;
    }
 
  
   getWeeksStartAndEndInMonth = function(_start,firstDate,numDays) {
    let weeks = [];
 
    let start = 1;
    let end = 7 - firstDate.getDay();
    if (_start === 'monday') {
        if (firstDate.getDay() === 0) {
            end = 1;
        } else {
            end = 7 - firstDate.getDay() + 1;
        }
    }
    while (start <= numDays) {
        weeks.push({start: start, end: end});
        start = end + 1;
        end = end + 7;
        end = start === 1 && end === 8 ? 1 : end;
        if (end > numDays) {
            end = numDays;
        }
    }
  
    return weeks;
}




viewtojson(){
  console.table(json)
 
}
addtojson(){

  
}
deletetojson(){
 
}

renderTableHeader() {
 // let header = Object.keys(this.state.jsondata)
  this.state.header.map((key, index) => {
    return <th key={index}>{key}</th>
 }) 
}
renderTableData() {
  return this.state.jsondata.map((emp, index) => {
    let col = Object.keys(emp)
    return (
        
    
       <tr key={emp.EmployeeName}>
         {col.map((val, index) => {
             return <td key={index}>{emp[col[index]]}</td>
          })}

       </tr>
    )
  })
}



onSelect(selectedList, selectedItem) {
 // console.log("event ",selectedItem)
 // console.log("event ",selectedList)
  this.setState({optionSelected:selectedList});
}

onRemove(selectedList, removedItem) {
 // this.setState({optionSelected:selectedList});
 this.setState({optionSelected:selectedList});
}
changeactivityname(e){
  this.setState({activityname:e.target.value});
}
onnameselect(selectedItem){ 
//  console.log("selected EMP: ",selectedItem[0])
  this.setState({empname:selectedItem[0]});
}
updatetojson(){

  if(this.state.optionSelected.length=== 0 && this.state.holidaystoggle === true){
   
    console.log("Please select holidays  :" )
  }
  else{
    var holidays=[];
    if(this.state.optionSelected.length=== 0 && this.state.holidaystoggle === false){
     // this.setState({optionSelected:this.state.selected});
      holidays=this.state.selected;
      console.log("No Holidays except sun and sat  :",this.state.selected )
    }
    else{
      holidays=this.state.optionSelected;
    }
    console.log("holidays: ",holidays) 
    console.log("jsondata: ",this.state.jsondata) 
    var userdata = this.state.jsondata //.filter((item)=>{ if(item.EmployeeName===this.state.empname){return item} })

    var weektaskname = `Week${this.state.presentweekno}TaskName`
    var weektotalhours = `Week${this.state.presentweekno}Totalhours`
    var totalhours = (7-holidays.length)*8;
    console.log(" update :",weektaskname,weektotalhours,(7-holidays.length)*8);

    var workingdays = [];
    var weekendholidays = [];
      this.state.selectoptions.map((item)=>{    // console.log(day.id)
      var count=0;
holidays.map((holiday)=>{ 
        if(item.id===holiday.id) {  weekendholidays.push("day"+item.id) ; return false }
        else{ count++; if(count===holidays.length){ workingdays.push("day"+item.id) } else{return false} }
        
       }) 
       
      })
      console.log("workingdays",weekendholidays)
      console.log("workingdays",workingdays)
    console.log("before update : ",userdata ) 
    userdata.map( (user)  => { if(user.EmployeeName === this.state.empname ){
          user[weektaskname]= this.state.activityname ;
           user[weektotalhours]= totalhours;
           workingdays.map((workingday)=>{ user[workingday] = 8; })
           weekendholidays.map((weekendholiday)=>{ user[weekendholiday] = 0; })
          
    }
    });
    console.log("after update :",userdata)
    this.setState({jsondata:userdata})
    var result;
    let formdata =new FormData();  
  formdata.append('filename',this.state.filename);
  formdata.append('jsondata',JSON.stringify(userdata));
  axios.post("http://localhost:8002/createjsonfile",formdata)
      .then(res=>{  
        result=   res.data;
        console.log("status text",res.statusText);

      })
    

  console.log("Holidays selected Selected :",this.state.optionSelected )
  console.log("Activity name :",this.state.activityname )
  console.log("selected EMP: ",this.state.empname  )

  this.setState({   
    optionSelected:[],
    activityname:'',
    empname:'',
    holidaystoggle: false,  });
    document.getElementById("activityname").value='';
   // console.log( document.getElementById("selectemp").childNodes[0].childNodes[0].firstChild.textContent)
   // console.log( document.getElementById("selectemp").childNodes[0].childNodes[0].childNodes[1].attributes[3])
  // document.getElementById("selectemp").childNodes[0].childNodes[0].firstChild.textContent='';
//  document.getElementById("selectemp").childNodes[0].childNodes[0].childNodes[1].attributes[3].value="Select Name"
//console.log( document.getElementById("selectemp").childNodes[0].childNodes[0].childNodes[1].attributes[3])
//console.log( document.getElementById("selectemp").childNodes[0].childNodes[0].firstChild)

  }
}
toggleStatefalse() {
  this.setState({
    holidaystoggle: false
  });
}
toggleStatetrue() {
  this.setState({
    holidaystoggle: true
  });
}

 
      render(){

  
    return (
    <div className="App">
          <ExcelViewExport data={this.state.jsondata} keys={this.state.header}/>
         {/* <DataGrid /> */}


         <button className="add" onClick={()=>this.viewtojson()}>View</button>
                <button className="add" onClick={()=>this.addtojson()}>Add</button>
                <button className="delete" onClick={()=>this.deletetojson()}>delete</button>
               
              <h1 id='title'>{this.state.presentweektext}</h1>
              <div id="selectemp">
              <Multiselect 
              options={this.state.employeelist} 
              isObject={false}               
              singleSelect
              onSelect={(selectedItem)=>this.onnameselect(selectedItem)}
              avoidHighlightFirstOption
              placeholder="Select Name"
              style={ { chips: { color: 'black' },
              optionContainer: {   border: '2px solid',width:'300px'}, 
              searchBox: { border: "none", "border-bottom": "1px solid blue", "border-radius": "0px",width:'300px' }}}
              /> </div>

                <button className="noholidays"  style={!this.state.holidaystoggle ?  {backgroundColor:'#0096fb'} : {backgroundColor:'#ddd'}} onClick={()=>this.toggleStatefalse()}>No Holidays</button>
                <button className="holidays" style={this.state.holidaystoggle ?  {backgroundColor:'#0096fb'} : {backgroundColor:'#ddd'}} onClick={()=>this.toggleStatetrue()}>Holidays</button>


                    
           { this.state.holidaystoggle && <div>
              <p>select dates id any holidays/leaves on this week : </p>

                  <Multiselect 
                  options={this.state.selectoptions} // Options to display in the dropdown
                  selectedValues={this.state.selected} // Preselected value to persist in dropdown
                  onSelect={(selectedList, selectedItem)=>this.onSelect(selectedList, selectedItem)} // Function will trigger on select event
                  onRemove={(selectedList, selectedItem)=>this.onRemove(selectedList, selectedItem)} // Function will trigger on remove event
                  displayValue="name" // Property name to display in the dropdown options
                  closeOnSelect={false}
                  avoidHighlightFirstOption
                  placeholder="Select Holidays"
                  style={ { chips: { color: 'black' },
                  optionContainer: {   border: '2px solid',width:'300px'}, 
                  searchBox: { border: "none", "border-bottom": "1px solid blue", "border-radius": "0px",width:'300px' }}}
                  // disablePreSelectedValues={true}
              />
              </div>
           }
              <input type="text" id="activityname" placeholder="enter Activity name" onChange={(e)=>this.changeactivityname(e)} />
               <button className="update" onClick={()=>this.updatetojson()}>update</button>
              
            
 
 
        
    </div>
  );
    }
}

export default App;
