'''
	You must replace <FMI> with your bucket name
'''
import boto3
import json

S3API = boto3.client("s3", region_name="us-west-2") 
bucket_name = "ar-2021-01-23-s3site"

policy_file = open("/home/ec2-user/environment/website_security_policy.json", "r")


S3API.put_bucket_policy(
    Bucket = bucket_name,
    Policy = policy_file.read()
)
print ("DONE")