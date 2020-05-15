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
 then it increments the AgencyCounter for each agecny that was detected in the collection.
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
  time: Timestamp<any>;
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
   totalNumPairVisits = 0 ;
   percentageOfPairVisits = 0;
   totalNumTripletVisits = 0;
    percentageOfTripletVisits = 0;
  totalNum5PlusVisits = 0;
  percentageOf5PlusVisits = 0;
  totalNum4Visits = 0;
  percentageOf4Visits = 0;
   commonPair = new Array();
   commonTriplet = new Array();

   agencyCounterPerID=0;
  //  counterArray ={1:0, 2:0 , 3:0}; //  key represents duplicate or triplit of agencies, value = their number
   // 32 max agency limit per visit - hopefully no one should ever reach this
   counterArray = [0,0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]   
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
    console.log("a");
    this.getStatistics();
  }

  getStatistics(): void{
    const visitArray = this.afs.collection("visits").snapshotChanges();

    visitArray.subscribe(payload => {
      this.totalNumVisits = 0;
      this.totalNumPairVisits = 0;
      this.percentageOfPairVisits = 0;
      this.totalNumTripletVisits = 0;
      this.percentageOfTripletVisits = 0;
      this.totalNum5PlusVisits = 0;
      this.percentageOf5PlusVisits = 0;
      this.totalNum4Visits = 0;
      this.percentageOf4Visits = 0;

      payload.forEach( item => {
        const visit = item.payload.doc.data() as Visit;
        //console.log("visit = ", visit);
        this.totalNumVisits += 1;
        
        // getting visited frequencies
        const visitedAgencies = this.afs.collection(visit.code.toString()).snapshotChanges();
        visitedAgencies.subscribe(payload => {


          this.agencyCounterPerID = payload.length;
          payload.forEach( item => {
            const agencyVisit = item.payload.doc.data() as AencyVisit; 
            this.agencyList.push(agencyVisit.AgencyID);
            //console.log("agencyList", this.agencyList);          
          });
          
          this.counterArray[this.agencyCounterPerID]+=1;
          if (this.agencyCounterPerID == 2) {
            this.totalNumPairVisits += 1;
            var result2 = this.agencyList.includes(this.agencyList[i]);
            this.mostCommonPairList[this.agencyList[i]] += 1;
          } else if (this.agencyCounterPerID == 3) {
            this.totalNumTripletVisits += 1;
            var result3 = this.agencyList.includes(this.agencyList[i]);
            this.mostCommonTripletList[this.agencyList[i]] += 1;
          } else if (this.agencyCounterPerID == 4) {
            this.totalNum4Visits += 1;
          } else if (this.agencyCounterPerID >= 5) {
            this.totalNum5PlusVisits += 1;
          }

          for (var i=2; i<this.counterArray.length; i++) {
           this.multiples+= this.counterArray[i];
          }

          // percentages
          this.pctMultipleAgencyVisits = this.totalNumVisits / this.counterArray[2];//this.multiples;
          this.totalMultipleVisits = this.totalNumPairVisits + this.totalNumTripletVisits + this.totalNum4Visits + this.totalNum5PlusVisits;
          //console.log(this.pctMultipleAgencyVisits);
          this.percentageOfPairVisits = this.totalNumPairVisits / this.totalMultipleVisits * 100 ;
          this.percentageOfTripletVisits = this.totalNumTripletVisits / this.totalMultipleVisits * 100;
          this.percentageOf4Visits = this.totalNum4Visits / this.totalMultipleVisits * 100;
          this.percentageOf5PlusVisits = this.totalNum5PlusVisits / this.totalMultipleVisits * 100;
          this.commonPair.push(this.agencyList[0]);
          this.commonPair.push(this.agencyList[1]);
          this.commonTriplet.push(this.agencyList[0]);
          this.commonTriplet.push(this.agencyList[0]);
          console.log("this.commonPair =", this.commonPair , "this.commonTriplet = ", this.commonTriplet)
         
          this.agencyCounterPerID =0;
          //empty the array
          this.agencyList.length = 0;

      
        });

        
    });
  
  });
  // console.log(this.counterArray[1] , " visit for " , 1 , "agencies");
  // console.log(this.counterArray[2] , " visit for " , 2 , "agencies");
  // console.log(this.counterArray[3] , " visit for " , 3 , "agencies");
  }

  formatPercent(num) {
    return Math.round(num * 100) / 100;
  }
}
