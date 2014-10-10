ChronoZoom for museums
==========

This is a main repository for ChronoZoom for museums bundle. Here you will find a source code for ChronoZoom's version for museums.

To use ChronoZoom's version for museums you need to deploy project from this repository locally or use 'ready to use' version of this repository which is located [here](https://github.com/alex-zen/ChronoZoom-museum-deploy). Also you need to use client application __CZ Museum Client__  in store (not available at store yet) or use source code for this application to which you can find [here](https://github.com/alex-zen/ChronoZoom-museum-client).

Requirements
------------

* Visual Studio 2013
* SQL Server 2012

Usage
-----

* Make a fork of ChronoZoom. 
* Run `git clone git://github.com/<your-username>/ChronoZoom.git` to clone it to local computer (Case Sensitive)
* Launch `Source\Chronozoom.sln`
* Enable EnableNuGetPackageRestore (Right click on VS Solution - Enable NuGet Package Restore)
* Open `web.config`, in connection strings locate
```
<add name="Storage" connectionString="Data Source=.\SQLExpress;Initial Catalog=ChronoZoom;Trusted_Connection=True" providerName="System.Data.SqlClient" />
```
and replace values for `Data Source` and `Catalog` with your local SQL Server and database names
* Use `[F5]` to compile and run ChronoZoom locally
* Publish `ChronoZoom.UI` using `File System` as a publish method to deploy it to other devices or to use locally in museum experience mode


For detailed instructions, see the [ChronoZoom Developer's Guide](Doc/ChronoZoom_Developer_Guide.md).

Start ChronoZoom for museums locally
------------------------------------

#### Without using client application

* Run ChronoZoom's service locally using IIS:
  - Suppose you have published this project to `C:/CZ Museum` or downloaded [https://github.com/alex-zen/ChronoZoom-museum-deploy](https://github.com/alex-zen/ChronoZoom-museum-deploy) to `C:/CZ Museum`.
  - Open command prompt, change directory where IIS or IIS Express is installed. For instance `C:/Program Files (x86)/IIS Express`.
  - Run following command
  ```
  issexpress.exe /path:"C:\CZ Museum" /port:2000
  ```
* Open web browser. Go to [http://localhost:2000/sandbox](http://localhost:2000/sandbox) to author data, go to [http://localhost:2000/sandbox?demo_mode=true](http://localhost:2000/sandbox?demo_mode=true) to view museum mode experience
 
#### Using client application

In this case you need to have two Windows users - one for authoring content and running local service (__author__), other for running application in museum exhibit experience (__museum__). __Museum__ user is a local windows user with restricted access.

* Create museum local Windows user with restricted access - steps are [here](http://www.techrepublic.com/blog/windows-and-office/set-up-a-pc-as-a-kiosk-using-windows-81s-assigned-access/). To install application to use for kiosk mode follow these steps first:
 - Login to __museum__ user and launch `Source/Chronozoom.sln`
 - Run application to install it for this user
 - Logout from __museum__ user, login to __author__ user
 - Apply restricted access for __museum__ user and use application as the only application this user can run
* Run ChronoZoom's service locally using IIS (it's mandatory to run application using port __2000__):
  - Suppose you have published this project to `C:/CZ Museum` or downloaded [https://github.com/alex-zen/ChronoZoom-museum-deploy](https://github.com/alex-zen/ChronoZoom-museum-deploy) to `C:/CZ Museum`.
  - Open command prompt, change directory where IIS or IIS Express is installed. For instance `C:/Program Files (x86)/IIS Express`.
  - Run following command (port __2000__ is mandatory in this case!)
  ```
  issexpress.exe /path:"C:\CZ Museum" /port:2000
  ```
* Switch user to __museum__ user (do not logout) to see museum experience
* For authoring of data switch user to __author__ user, open web browser and go to [http://localhost:2000/sandbox](http://localhost:2000/sandbox)

Acknowledgements
----------
ChronoZoom is built and maintained by a growing community, with the support of:

* University of California Berkeley
* Moscow State University
* University of Washington
* Microsoft Research

License
----------
ChronoZoom is made available under the [Apache 2.0 license](blob/master/Source/LICENSE.TXT).

To contribute to the project, please sign a [Contributor's Agreement](http://www.outercurve.org/Participate#Contributing_to_a_project).

[![Outercurve Foundation](http://www.outercurve.org/Portals/0/Skins/CodePlex_NEW/images/footer-logo.jpg)](http://www.outercurve.org/)
