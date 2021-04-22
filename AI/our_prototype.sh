#!/bin/bash -l
# NOTE the -l flag!
#

# This is an example job file for a Serial Multi-Process job.
# Note that all of the following statements below that begin
# with #SBATCH are actually commands to the SLURM scheduler.
# Please copy this file to your home directory and modify it
# to suit your needs.
# 
# If you need any help, please email rc-help@rit.edu
#

# Name of the job - You'll probably want to customize this.
#SBATCH -J our_prototype
#SBATCH -A uas    #account

# Standard out and Standard Error output files
#SBATCH -o our_output_%A.output
#SBATCH -e our_err_%A.error

#To send emails, set the adcdress below and remove one of the "#" signs.
#SBATCH --mail-user jtm5356@rit.edu

# notify on state change: BEGIN, END, FAIL or ALL
#SBATCH --mail-type=ALL

# Request 5 hours run time MAX, anything over will be KILLED
#SBATCH -t 4-0     # if you want to run for 4 days 1-72:0:0

# Put the job in the "work" partition and request FOUR cores for one task
# "work" is the default partition so it can be omitted without issue.

## Please note that each node on the cluster is 36 cores
#SBATCH -p tier3 -n 1

# Job memory requirements in MB
#SBATCH --mem-per-cpu=5G  # I like to mem with a suffix [K|M|G|T] 5000


# RUN TENSORFLOW JOB #

PATH_TO_AI="/home/jtm5356/ourepository/AI"

# generate test images
cd $PATH_TO_AI
python -m test.generate_test_img

# image  slicing and TFRecords
python -m scripts.preprocessing.crop

echo "plz"

# begin training
#python -m scripts.model_main_tf2

# export model
#python -m scripts.exporter_main_v2

# evaluate
#python -m scripts.evaluation.inference

echo "finished!"