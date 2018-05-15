#!/bin/bash

#THIS SCRIPT BREAKS UP A LARGE FILE INTO 500 MB CHUNKS TO PREVENT OTHER SCRIPTS FROM RUNNING OUT OF RESOURCES WHEN HANDLING MASSIVE FILES

echo "Enter path to file to be split"
read PATH_TO_FILE

echo "Enter filename prefix"
read PREFIX

split --bytes 500M --numeric-suffixes --suffix-length=3 $PATH_TO_FILE ${PREFIX}.


