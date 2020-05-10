import { Component, OnInit } from '@angular/core';

// Firestore imports 
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import {Observable,of, from, Timestamp } from 'rxjs';
//import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';
import { NgForm, NgModel } from '@angular/forms';

/*

TODO
1. identify group visits and exclude them from the getStatistics()
2. correct the common pair and common triplet algorithm
3.

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
   totalNumPairVisits = 0 ;
   percentageOfPairVisits = 0;
   totalNumTripletVisits = 0;
   percentageOfTripletVisits = 0;
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
    visitArray.subscribe( payload => {
      payload.forEach( item => {
        const visit = item.payload.doc.data() as Visit;
        //console.log("visit = ", visit);

        
        // getting visited frequencies
        const visitedAgencies = this.afs.collection(visit.code.toString()).snapshotChanges();
        visitedAgencies.subscribe( payload => {
          payload.forEach( item => {
            this.totalNumVisits+=1;
            this.agencyCounterPerID+=1;
            const agencyVisit = item.payload.doc.data() as AencyVisit; 
            this.agencyList.push(agencyVisit.AgencyID);
            //console.log("agencyList", this.agencyList);          
            
          });
          
          this.counterArray[this.agencyCounterPerID]+=1;
          

          // getting visited Agenccies based on the agencyCounterPerID
          for(var i = 0;i<this.agencyList.length;i++) { 
            if (this.agencyCounterPerID == 2) {
              this.totalNumPairVisits +=1;
              var result2 = this.agencyList.includes(this.agencyList[i]);
              this.mostCommonPairList[this.agencyList[i]] +=1;
            } else if (this.agencyCounterPerID == 3){
              this.totalNumTripletVisits +=1 ;
              var result3 = this.agencyList.includes(this.agencyList[i]);
              this.mostCommonTripletList[this.agencyList[i]] +=1; 
            }
          }
          for (var i=2; i<this.counterArray.length; i++) {
           this.multiples+= this.counterArray[i];
          }

          // percentages
          this.pctMultipleAgencyVisits = this.totalNumVisits / this.counterArray[2];//this.multiples;
          //console.log(this.pctMultipleAgencyVisits);
          this.percentageOfPairVisits = this.totalNumPairVisits / this.totalNumPairVisits * 100 ;
          this.percentageOfTripletVisits = this.totalNumTripletVisits / this.totalNumVisits * 100;
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
}
