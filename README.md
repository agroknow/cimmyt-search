# CIMMYT Open Meta-search

This project is built on top of CIMMYT online repositories and allows for users to search through scientific resources of the institute. Such resources can be: publications, images, videos and datasets.

## Installation

To install this app, simply copy and paste its folder on an Apache server web root. The app should then be available under: http://*server_domain*/cimmyt.

## Configuration

If you want to create a custom domain name for this app, simply make sure to change the base-url meta-tag in the index.php from "/cimmyt/" to "/".

Also, this project works with a specific URL of the given API. To change this, simply set the base_url variable in *conf.json* without a trailing slash and you're all done!
