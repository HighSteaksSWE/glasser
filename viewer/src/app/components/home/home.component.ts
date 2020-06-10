import { Component, OnInit } from '@angular/core';

// Firestore imports 
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import {Observable,of, from, Timestamp } from 'rxjs';
//import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';
import { NgForm, NgModel } from '@angular/forms';

/*
 getStatistics function:

The goal of this function is to iterate through the database and get the required statistics.
The structure of the database:
  visits IDs are stored as collections, files, in the firestore database.
  Visits of the same ID are stored as documents inside each collection.
The function iterates through each collection, ID,  and counts how many visits are stored in each ID,
 then it increments the AgencyCounter for each agency that was detected in the collection.
The iteration over collections and documents in the database is done by using the "payload.forEach" method

TODO
1. Identify group visits and exclude them from the getStatistics()
2. correct the common pair and common triplet algorithm. Agencies should be sorted based on how many times 
   they appreared in the pair or triplet visits.

 */

interface  Visit{
  code: number;
}

// interface that defines the agency visit structure
interface  AencyVisit{
  AgencyID: string;
  code: string;
  Time: any;
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

   // Connect Agency to Firebase collection
   visitCollection: AngularFirestoreCollection<Visit>;
   visits: Observable<Visit[]>;

   // Statistics fields
  totalNumVisits = 0;
  totalMultipleVisits = 0;
  highestPair = 0;
  highestTriplet = 0;
   totalNumPairVisits = 0 ;
   percentageOfPairVisits = 0;
   totalNumTripletVisits = 0;
    percentageOfTripletVisits = 0;
	visitCount = 0;
	test = 0;
  totalNum5PlusVisits = 0;
  lastHighestPair = 0;
  lastHighestTriplet = 0;
  percentageOf5PlusVisits = 0;
  totalNum4Visits = 0;
  percentageOf4Visits = 0;
  keyHolder = "";
  valueAdjuster = 0;
  timer = null;
  theTime = "";
  halfDay = "";
  totalVisitCount = 0;
  //globalValues:new Array();
  k = 0;
  z = 0;
  hoursArray = new Array();
  daysArray = new Array();
  hour = new Array();
  day = new Array();
  timed = new Array();
  timedAfter = new Array();
  mostCommonTime = new Array();
   commonPairs = new Array();
   commonPair = new Array();
   commonTriplets = new Array();
   commonTriplet = new Array();
   pairValues = [];
   tripletValues = [];
   holdValues = new Array();
   //values: Observable<any>;
   //valuesy: Observable<this.values[]>;
   countVisitsAnalyzed = 0;
   //this.values.push(rand = new Array());
   //visitsy = new Array<Observable<Visit[]>>();

   agencyCounterPerID=0;
  //  counterArray ={1:0, 2:0 , 3:0}; //  key represents duplicate or triplet of agencies, value = their number
   // 32 max agency limit per visit - hopefully no one should ever reach this
   counterArray = [0,0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]   
   //pairArray = new Map<Array<Object>, number>(); 
   pairArray = new Map<string, number>();
   tripletArray = new Map<string, number>();
   hourArray = new Map<string, number>();
   dayArray = new Map<string, number>();
   multiples = 0;
   //  mostCommonPairList and mostCommonTripletList will be used to filter the most common pair and triplet agencies
   mostCommonPairList = {"DEMO-B-Geese":1, "DEMO-A-Berges":1, "DEMO-C1-Gentle":1, "DEMO-C2-Crunke":1,"DEMO-C3-Girls":1, "DEMO-D-Literacy":1, "DEMO-E-Life":1,"DEMO-F-Pools":1};
   mostCommonTripletList = {"DEMO-B-Geese":1, "DEMO-A-Berges":1, "DEMO-C1-Gentle":1, "DEMO-C2-Crunke":1,"DEMO-C3-Girls":1, "DEMO-D-Literacy":1, "DEMO-E-Life":1,"DEMO-F-Pools":1};
   agencyList = new Array(); 
   IDField: Observable<any>;

   // Percentage calculations
   pctMultipleAgencyVisits: number;

  constructor(private afs: AngularFirestore) { }

  ngOnInit(): void {
    // console.log("a");
	//this.getNum();
	this.getStatistics();
  }
  
  

  getStatistics(): void{
    const visitArray = this.afs.collection("visits").snapshotChanges();
	
	//console.log([this.afs.collectionGroup("visits")].length);
	this.k = 0;
	for (let val of visitArray.toString()){
		this.k += 1;
		console.log(this.k);
	}
	
    visitArray.subscribe(payload => {
	  this.totalVisitCount = payload.length;
      this.totalNumVisits = 0;
      this.totalNumPairVisits = 0;
      this.percentageOfPairVisits = 0;
      this.totalNumTripletVisits = 0;
      this.percentageOfTripletVisits = 0;
      this.totalNum5PlusVisits = 0;
      this.percentageOf5PlusVisits = 0;
      this.totalNum4Visits = 0;
      this.percentageOf4Visits = 0;
	  //this.visitCount = 0;
	  //const values = [];
	  //this.values = []
	  //this.visitedAgenciesLength = 0;
	  //console.log("lens:", this.visitArray);
	  

      payload.forEach( item => {
        const visit = item.payload.doc.data() as Visit;
		//const values = [];
        this.totalNumVisits += 1;
		this.timer = null;
        
        // getting visited frequencies
        const visitedAgencies = this.afs.collection(visit.code.toString()).snapshotChanges();
		
		//this.visitedAgenciesLength = visitedAgencies.toString().length;
		//console.log("len:", this.visitedAgenciesLength);
		
        visitedAgencies.subscribe(payload => {	
		  
		  this.visitCount = this.visitCount + 1;
		  //console.log("gettyburg: ", visitArray.toString().length);
		
          this.agencyCounterPerID = payload.length;
		  this.k = 0;
		  this.z = 0;
		  this.test += 1;
		  //console.log("test", this.test, "len:", this.agencyCounterPerID);
		  //console.log("len:", this.agencyCounterPerID);
          payload.forEach( item => {
            const agencyVisit = item.payload.doc.data() as AencyVisit;
			//const herro = item.payload.doc.timestamp.value;
			//console.log(herro);
			//console.log("len:", this.agencyCounterPerID);
            this.agencyList.push(agencyVisit.AgencyID);
			//console.log(agencyVisit.Time.toDate().toString());
			this.timed = agencyVisit.Time.toDate().toString().split(" ");
			//console.log(this.timed);
			this.timedAfter = this.timed[4].split(":");
			//console.log(this.timedAfter);
			this.hoursArray.push(this.timedAfter[0]);
			this.daysArray.push(this.timed[0]);
			//console.log("log", this.agencyVisit.toString());
			//console.log("visit", this.agencyCounterPerID);

			// Add visit pairs to nested list for later analysis
			if (this.agencyCounterPerID == 2){
				
				if (this.k == 0){
				    this.pairValues.push(new Array(agencyVisit.AgencyID.toString()));
				}
				
				if (this.k == 1){
					this.pairValues[this.pairValues.length - 1].push(agencyVisit.AgencyID.toString());
				}
				this.k = this.k + 1;
			}
			
			if (this.agencyCounterPerID == 3){
				
				if (this.z == 0){
					//console.log("here");
				    this.tripletValues.push([agencyVisit.AgencyID.toString()]);
				}
				
				if (this.z == 1){
					//console.log("here1");
					this.tripletValues[this.tripletValues.length - 1].push(agencyVisit.AgencyID.toString())
				}
				
				if (this.z == 2){
					//console.log("here2");
					this.tripletValues[this.tripletValues.length - 1].push(agencyVisit.AgencyID.toString());
				}
				this.z = this.z + 1;
			}
			
          });
		  
		  
          this.counterArray[this.agencyCounterPerID]+=1;
          if (this.agencyCounterPerID == 2) {
            this.totalNumPairVisits += 1;			
          }
		  else if (this.agencyCounterPerID == 3) {
            this.totalNumTripletVisits += 1;
          } 
		  else if (this.agencyCounterPerID == 4) {
            this.totalNum4Visits += 1;
          } 
		  else if (this.agencyCounterPerID >= 5) {
            this.totalNum5PlusVisits += 1;
          }

          for (var i=2; i<this.counterArray.length; i++) {
           this.multiples+= this.counterArray[i];
          }

          // percentages
          this.pctMultipleAgencyVisits = this.totalNumVisits / this.counterArray[2];//this.multiples;
          this.totalMultipleVisits = this.totalNumPairVisits + this.totalNumTripletVisits + this.totalNum4Visits + this.totalNum5PlusVisits;
          this.percentageOfPairVisits = this.totalNumPairVisits / this.totalMultipleVisits * 100 ;
          this.percentageOfTripletVisits = this.totalNumTripletVisits / this.totalMultipleVisits * 100;
          this.percentageOf4Visits = this.totalNum4Visits / this.totalMultipleVisits * 100;
          this.percentageOf5PlusVisits = this.totalNum5PlusVisits / this.totalMultipleVisits * 100;
          this.commonPair.push(this.agencyList[0]);
          this.commonPair.push(this.agencyList[1]);
          this.commonTriplet.push(this.agencyList[0]);
          this.commonTriplet.push(this.agencyList[0]);
         
          this.agencyCounterPerID =0;
          //empty the array
          this.agencyList.length = 0;
		  //console.log("vl: ", this.values.length, ", vc: ", this.visitCount);
		  
		  
		  
		  for (let v = 0; v < this.hoursArray.length; v++){
				if (this.hourArray.has(this.hoursArray[v]) == false){
					this.hourArray.set(this.hoursArray[v], 1);
					//console.log("here2");
				}
				else if (this.hourArray.has(this.hoursArray[v]) == true){
					//return this.pairArray;
					for (let a = 0; a < 10000; a++){
						if (this.hourArray.get(this.hoursArray[v]) == a){
							this.keyHolder = this.hoursArray[v];
							this.valueAdjuster = a + 1;
								
							this.hourArray.delete(this.hoursArray[v]);
							//console.log("here3");
						}
						//console.log("here4");
					}
				this.hourArray.set(this.keyHolder, this.valueAdjuster);
			}
		  }
		  
			this.highestTriplet = 0;
			for (let [key, value] of this.hourArray) {
				//console.log("here7");
				if (value > this.highestTriplet){
					this.highestTriplet = value;
					//console.log("here6");
				}
			}
					
			//add highest frequency pair to list
			for (let [key, value] of this.hourArray) {
				//console.log("here9");
				if (value == this.highestTriplet && this.hour.indexOf(key) == -1){
					this.hour.push(key);
					//console.log("here8");
					//break;
				}
			}
			
			
			
			for (let v = 0; v < this.hoursArray.length; v++){
				if (this.dayArray.has(this.daysArray[v]) == false){
					this.dayArray.set(this.daysArray[v], 1);
					//console.log("here2");
				}
				else if (this.dayArray.has(this.daysArray[v]) == true){
					//return this.pairArray;
					for (let a = 0; a < 10000; a++){
						if (this.dayArray.get(this.daysArray[v]) == a){
							this.keyHolder = this.daysArray[v];
							this.valueAdjuster = a + 1;
								
							this.dayArray.delete(this.daysArray[v]);
							//console.log("here3");
						}
						//console.log("here4");
					}
				this.dayArray.set(this.keyHolder, this.valueAdjuster);
			}
		  }
		  
			this.highestTriplet = 0;
			for (let [key, value] of this.dayArray) {
				//console.log("here7");
				if (value > this.highestTriplet){
					this.highestTriplet = value;
					//console.log("here6");
				}
			}
					
			//add highest frequency pair to list
			for (let [key, value] of this.dayArray) {
				//console.log("here9");
				if (value == this.highestTriplet && this.day.indexOf(key) == -1){
					this.day.push(key);
					//console.log("here8");
					//break;
				}
			}
		  //console.log("hry", Number(this.hour[0]));
		  
		  if (Number(this.hour[0]) == 0 || Number(this.hour[0]) == 24){
			  this.theTime = "12";
			  this.halfDay = "am";
		  }
		  if (Number(this.hour[0]) == 1){
			  this.theTime = "1";
			  this.halfDay = "am";
		  }
		  if (Number(this.hour[0]) == 2){
			  this.theTime = "2";
			  this.halfDay = "am";
		  }
		  if (Number(this.hour[0]) == 3){
			  this.theTime = "3";
			  this.halfDay = "am";
		  }
		  if (Number(this.hour[0]) == 4){
			  this.theTime = "4";
			  this.halfDay = "am";
		  }
		  if (Number(this.hour[0]) == 5){
			  this.theTime = "5";
			  this.halfDay = "am";
		  }
		  if (Number(this.hour[0]) == 6){
			  this.theTime = "6";
			  this.halfDay = "am";
		  }
		  if (Number(this.hour[0]) == 7){
			  this.theTime = "7";
			  this.halfDay = "am";
		  }
		  if (Number(this.hour[0]) == 8){
			  this.theTime = "8";
			  this.halfDay = "am";
		  }
		  if (Number(this.hour[0]) == 9){
			  this.theTime = "9";
			  this.halfDay = "am";
		  }
		  if (Number(this.hour[0]) == 10){
			  this.theTime = "10";
			  this.halfDay = "am";
		  }
		  if (Number(this.hour[0]) == 11){
			  this.theTime = "11";
			  this.halfDay = "am";
		  }
		  if (Number(this.hour[0]) == 12){
			  this.theTime = "12";
			  this.halfDay = "am";
		  }
		  if (Number(this.hour[0]) == 13){
			  this.theTime = "1";
			  this.halfDay = "pm";
		  }
		  if (Number(this.hour[0]) == 14){
			  this.theTime = "2";
			  this.halfDay = "pm";
		  }
		  if (Number(this.hour[0]) == 15){
			  this.theTime = "3";
			  this.halfDay = "pm";
		  }
		  if (Number(this.hour[0]) == 16){
			  this.theTime = "4";
			  this.halfDay = "pm";
		  }
		  if (Number(this.hour[0]) == 17){
			  this.theTime = "5";
			  this.halfDay = "pm";
		  }
		  if (Number(this.hour[0]) == 18){
			  this.theTime = "6";
			  this.halfDay = "pm";
		  }
		  if (Number(this.hour[0]) == 19){
			  this.theTime = "7";
			  this.halfDay = "pm";
		  }
		  if (Number(this.hour[0]) == 20){
			  this.theTime = "8";
			  this.halfDay = "pm";
		  }
		  if (Number(this.hour[0]) == 21){
			  this.theTime = "9";
			  this.halfDay = "pm";
		  }
		  if (Number(this.hour[0]) == 22){
			  this.theTime = "10";
			  this.halfDay = "pm";
		  }
		  if (Number(this.hour[0]) == 23){
			  this.theTime = "11";
			  this.halfDay = "pm";
		  }
		  
		  
		  //console.log("hello" + "then");
		  this.mostCommonTime.push(this.day[0] + "," + " " + this.theTime + " " + this.halfDay);
		  //this.visitCount = 21;
		  //console.log(visitArray.toString());
		  //console.log("length:", visitArray.toString().length);
		  // Pairs and Triplets data
		  if (this.totalVisitCount == this.visitCount){
		  //if (false){
			console.log("pairValues", this.pairValues.toString());
			console.log("tripletValues", this.tripletValues.toString());
			//console.log("hey");
			//format pairs into sorted strings
			for (let u = 0; u < this.pairValues.length; u++){
				this.pairValues[u].sort();
				this.pairValues[u].toString();
				//console.log("here1");
			}
			
			//format triplets into sorted strings
			for (let u = 0; u < this.tripletValues.length; u++){
				this.tripletValues[u].sort();
				this.tripletValues[u].toString();
				//console.log("here1");
			}
			
			//add pair values to map(dictionary)
			for (let p = 0; p < this.pairValues.length; p++){
				if (this.pairArray.has(this.pairValues[p].toString()) == false){
					this.pairArray.set(this.pairValues[p].toString(), 1);
					//console.log("here2");
				}
				else if (this.pairArray.has(this.pairValues[p].toString()) == true){
					//return this.pairArray;
					for (let a = 0; a < 10000; a++){
						if (this.pairArray.get(this.pairValues[p].toString()) == a){
							this.keyHolder = this.pairValues[p].toString();
							this.valueAdjuster = a + 1;
								
							this.pairArray.delete(this.pairValues[p].toString());
							//console.log("here3");
						}
						//console.log("here4");
					}
					this.pairArray.set(this.keyHolder, this.valueAdjuster);
					//console.log("here5");
				}
			}
			
			//add triplet values to map(dictionary)
			for (let p = 0; p < this.tripletValues.length; p++){
				if (this.tripletArray.has(this.tripletValues[p].toString()) == false){
					this.tripletArray.set(this.tripletValues[p].toString(), 1);
					//console.log("here2");
				}
				else if (this.tripletArray.has(this.tripletValues[p].toString()) == true){
					//return this.pairArray;
					for (let a = 0; a < 10000; a++){
						if (this.tripletArray.get(this.tripletValues[p].toString()) == a){
							this.keyHolder = this.tripletValues[p].toString();
							this.valueAdjuster = a + 1;
									
							this.tripletArray.delete(this.tripletValues[p].toString());
							//console.log("here3");
						}
						//console.log("here4");
					}
					this.tripletArray.set(this.keyHolder, this.valueAdjuster);
					//console.log("here5");
				}
			}
					
			//find number of occurences of highest frequency pair
			this.highestPair = 0;
			for (let [key, value] of this.pairArray) {
				//console.log("here7");
				if (value > this.highestPair){
					this.highestPair = value;
					//console.log("here6");
				}
			}
			
			//find number of occurences of highest frequency triplet
			this.highestTriplet = 0;
			for (let [key, value] of this.tripletArray) {
				//console.log("here7");
				if (value > this.highestTriplet){
					this.highestTriplet = value;
					//console.log("here6");
				}
			}
					
			//add highest frequency pair to list
			for (let [key, value] of this.pairArray) {
				//console.log("here9");
				if (value == this.highestPair && this.commonPairs.indexOf(key) == -1){
					this.commonPairs.push(key);
					//console.log("here8");
					//break;
				}
			}
			
			//add highest frequency triplet to list
			for (let [key, value] of this.tripletArray) {
				//console.log("here9");
				if (value == this.highestTriplet && this.commonTriplets.indexOf(key) == -1){
					this.commonTriplets.push(key);
					//console.log("here8");
					//break;
				}
			}
					
			//find number of occurences of second highest frequency pair
			this.lastHighestPair = this.highestPair;
			this.highestPair = 0;
			for (let [key, value] of this.pairArray) {
				//console.log("here11");
				if (value > this.highestPair && value != this.lastHighestPair){
					this.highestPair = value;
					//console.log("here10");
				}
			}
			
			//find number of occurences of second highest frequency pair
			this.lastHighestTriplet = this.highestTriplet;
			this.highestTriplet = 0;
			for (let [key, value] of this.tripletArray) {
				//console.log("here11");
				if (value > this.highestTriplet && value != this.lastHighestTriplet){
					this.highestTriplet = value;
					//console.log("here10");
				}
			}
					
			//add second highest frequency pair to list
			for (let [key, value] of this.pairArray) {
				//console.log("here13");
				if (value == this.highestPair && this.commonPairs.indexOf(key) == -1){
					this.commonPairs.push(key);
					//console.log("here12");
				}
			}
			//console.log("val: ", this.tripletValues.toString());
			
			//add second highest frequency triplet to list
			for (let [key, value] of this.tripletArray) {
				//console.log("here13");
				if (value == this.highestTriplet && this.commonTriplet.indexOf(key) == -1){
					this.commonTriplets.push(key);
					//console.log("here12");
				}
			}
			//console.log("val: ", this.commonTriplets.toString());
					
					
					
			//Prints out the common pair and triplet dictionaries((4)//// = keep commented)
			
			for (let [key, value] of this.pairArray) {
				////console.log("here14");
				console.log("Pair key: ", key.toString(), ", Pair value: ", value);
			}
			
			for (let [key, value] of this.tripletArray) {
				////console.log("here14");
				console.log("Triplet key: ", key.toString(), ", Triplet value: ", value);
			}
			
			
			//console.log("pair: ", this.pairArray.toString());
			//console.log("triplet: ", this.tripletArray.toString());
			  
		  }
	  
        });
		
    });
  
  });
			
	
  
  //console.log("values", this.values);
  
  // console.log(this.counterArray[1] , " visit for " , 1 , "agencies");
  // console.log(this.counterArray[2] , " visit for " , 2 , "agencies");
  // console.log(this.counterArray[3] , " visit for " , 3 , "agencies");
  
    //console.log("len", this.values.length);
	
	//console.log("counter: ", this.counterArray);
	
	
	
	//console.log("cp: ", typeof(this.commonPairs[0]));
	//console.log("v: ", typeof(this.values[0]));
	//console.log("values: ", this.values);
  
  }
  
  formatPercent(num) {
    return Math.round(num * 100) / 100;
  }
}
