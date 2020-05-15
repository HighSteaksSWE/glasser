# Visit tracker and aggregator for the [Glasser/Schoenbaum Human Services Center](https://gs-humanservices.org/)

Glasser/Schoenbaum provides a home to dozens of non-profit organizations across its sprawling campus of over 15 different buildings. Unlike similar non-profit centers that are a single building with a centralized circulation desk, individuals and families obtaining services from a Glasser-based nonprofit agency go directly to the building of that agency. This is excellent for convenience but makes it difficult to gather accurate data regarding campus visits and agency collaboration initiatives.

Our prototype software aims to solve this problem in three parts:

1. A disposable ID card or wristband that visitors to campus carry around to each nonprofit agency they visit in a day
1. A **Visitor** interface for agency representatives to quickly log the number of people who utilize their services
1. A **Viewer** platform for Glasser/Schoenbaum to view tracked visits and insights about visit data

## The Process
How many people visit the Glasser/Schoenbaum campus in a day? How many people visit multiple agencies when they come to campus?

When a visitor arrives on campus for the first time, they pick up an ID card (or wristband) at the first agency they enter.

Their service provider scans their ID using our **Visitor** interface. (If their device doesn't have a camera or the ID card is damaged or unscannable in some way, the service provider may enter the numeric ID code marked next to the scannable code.)

The **Visitor** enters into a Firebase model:
* the visit's numeric ID
* which agency was visited
* current time and date

The ID is used to link multiple agency visits to one campus visit.

When the visitor leaves campus that day, they can dispose of their ID. They will collect a fresh one the next time they visit campus.

## Visitor Component
The Visitor component is meant for use by agencies to quickly track visits without interrupting their normal workflow or adding to the endless torrent of patient intake forms. 

Service providers simply navigate to the visitor Web address using a phone or computer, select the agency they represent, and begin logging IDs.

They can also track a group visit of any size and the Visitor will automatically generate IDs for each member of the group.

## Viewer Component
The Viewer component is meant for use by Glasser/Schoenbaum stakeholders to easily view statistics and data of and about visits to campus.

After logging in with a correct password, a user can view an automatically generated assortment of visit data updated in real-time. Statistics available to view currently include:
* Total number of visits
* Total number of multi-agency visits
* Percentage of campus visits including multiple agencies
* Number of *n*-agency visits and percentage of multi-agency visits that are to *n* agencies specifically
* Most popular pairing (when people visit two agencies in a day, which combination of two is most common?)
* Most common triplet (same as above but with 3 agencies)

## Privacy
This software tracks visits, not people.

Unique visit identifiers are disposable and visitors may choose to replace theirs at any time or not collect one at all.

The Visitor component does not display any data beyond a confirmation that a particular visit was logged. It does not collect log histories. No metadata about visits except for time and agency are ever collected.

All data displayed in the Viewer component is aggregated. Information about a single visit, agency, or pattern is never shown.
