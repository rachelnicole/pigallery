｡・ﾟﾟ・ ᵗᶦⁿʸ ᵍᵃˡˡᵉʳʸ ・ﾟﾟ・｡
====================

![alt text](uc.gif "Under Construction")

![its the tiny gallery](tinygallery.gif "cute gifs")

This documentation is ever-changing as new improvements are made to the codebase, and as we come up with better explanations for all skill levels. The README.md is still being completed, and as it's not complete, please feel free to watch the project as updates are available.

The code is extremely alpha, and has not been refactored, but will be as we make better decisions.

About
------------
Tiny Gallery is a project that allows you to display pixel art on a Raspberry Pi, the pixel art is controlled from a hosted web site, and when you click on the art piece you want to display, it shows up for 2 seconds. It's a fun and cute interactive project, and you can totally make one yourself! Lets learn how.

Prerequisites
------------

  - Install Git https://www.git-scm.com/book/en/v2/Getting-Started-Installing-Git
  - Have an account on GitHub http://www.github.com
  - Have a Microsoft account (outlook, live, etc) so you can set up a web app on Azure with auto deployment & have access to the IoT hub.
  - Make sure you have node installed for your correct operating machine. This guide explains how to install it, and also tells you how to install npm, which we will also be using. https://docs.npmjs.com/getting-started/installing-node
  - Basic understanding of the command line. Know how to navigate into different directories, and open files in an editor.
  - Know how to solder wires together, here's a good tutorial: http://www.tested.com/tech/5447-we-teach-you-how-to-properly-solder/


Things we'll Learn
-------

 - How to utilize Version Control for a more effective workflow.
 - How to utilize Continuous Deployment with github & Microsoft Azure.
 - How to use Microsoft's IoT Hub.
 - How to set up a Raspberry Pi Model 3 environment.
 - How to run C code for hardware interaction from a Node backend.
 - How to wire up a 32x32 led matrix to a raspberry pi.
 - How to set up a Node.js Web App with socket.io & express.

Part List
-----

- [32x32 led matrix](https://www.amazon.com/gp/product/B00KHBJPIK/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B00KHBJPIK&linkCode=as2&tag=ohhoe-20&linkId=e948c198e915222e58dea1782899d1ea)
- [Plug/Socket Jumper Wire](https://www.amazon.com/gp/product/B01L5UKAPI/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B01L5UKAPI&linkCode=as2&tag=ohhoe-20&linkId=7503f59de7eee2cf35700c0000fdc226)
- [Raspberry Pi Model 3, with power supply](https://www.amazon.com/gp/product/B01C6EQNNK/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B01C6EQNNK&linkCode=as2&tag=ohhoe-20&linkId=ab7398ae86780f942d377cf0e524c081)
- [Female DC Power Adapter](https://www.amazon.com/gp/product/B00KAE1QGS/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B00KAE1QGS&linkCode=as2&tag=ohhoe-20&linkId=08889d0ad939e08dec7d298610daaf82)
- [5v Power Supply](https://www.amazon.com/gp/product/B01LY5TG5Y/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B01LY5TG5Y&linkCode=as2&tag=ohhoe-20&linkId=305cc6affd70545109cf87946aa3f4fc)
- [Heat Shrink](https://www.amazon.com/gp/product/B00EXLPLTW/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B00EXLPLTW&linkCode=as2&tag=ohhoe-20&linkId=1b5d22ef921059765ac652dfbd23ba3b)
- [Soldering Iron](https://www.amazon.com/Tabiger-Soldering-110V-Adjustable-Temperature-Welding/dp/B01H1IFT54/ref=as_li_ss_tl?s=hi&ie=UTF8&qid=1496174006&sr=1-4&keywords=soldering+iron&linkCode=ll1&tag=ohhoe-20&linkId=3caef8a3dcb210d170d42e9541bd72cb) This is a fine beginner kit.
- Solder (comes with above kit, or buy separately)

Hardware Set-Up
-------

TODO.

Code Time!
-------
This repository includes the code that I've created, though we'll also be using the library https://github.com/hzeller/rpi-rgb-led-matrix/ for the actual displaying of the animated gifs on the pi. 

Lets start by cloning this repository onto your local machine, or downloading the zip file.

Inside the repo you've downloaded exists two separate code bases. One that lives on your hosted site, and the pi folder which is the code that will be running on your pi.


Current Known Issues
------
- No queing for images clicked across various open connections with the hosted site
- No capability to upload your own images, have to be hard added.
- No indication of whether or not the pi is offline.

Current Unknown Issues
-----

[I don't know, why don't you open an issue and tell me so we can make it better together!](https://github.com/rachelnicole/pigallery/issues)

Future Features
-------
- Non-interactive mode, just run gifs on the matrix without internet connectivity. 
- Allow for uploading of gifs from server to pi.
- Allow for live drawing on a canvas element to update on the pi.
- ???