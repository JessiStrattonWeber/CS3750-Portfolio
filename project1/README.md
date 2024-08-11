# Project 1: Node/Express Site With File Storage

## Goal:

Practice Node and Express in preparation for upcoming React assignments.

## Assignment overview:

### Create a Node/Express website which has the following characteristics:

* One HTML page which uses an HTML form to ask the user for a first name, last name, and favorite food. This HTML page exists on the backend. It has a form in it.  The form itself upon submission sends data to a route on your backend. The route then stores all three pieces of information into a text file.

* Another page which displays all information found in that file in that text file. This page does NOT exist as an HTML page on the backend. Rather it's a route which generates one big HTML string. Or in other words, when the user invokes the route, the route then starts generating an HTML page via a string. The route then reads the file. For each entry in the file, add one more table row into the string. When the file is done, complete the HTML string. When the string is fully generated, the route sends that HTML string back to the user as part of a res.send() call. (Note, this is ugly design! React will make this much cleaner.)

* Another HTML page which asks the user for a food. It then displays all people who match that food. This HTML page does exist on the backend. It has a form in it. The form itself upon submission sends data to a route on the backend. The route on the backend then sends a big HTML string back to the user to display this as part of a res.send() call.

* Has a clean layout with routes and pages organized into separate folders.