#!/usr/bin/env node
import "source-map-support/register";

import * as cdk from "aws-cdk-lib";
import { Tags } from "aws-cdk-lib";
import { PreSignedUrlsStack } from "../lib/pre-signed-urls-stack";

const app = new cdk.App();

const stack = new PreSignedUrlsStack(app, "pre-signed-urls", {});

Tags.of(stack).add("project", "pre-signed-urls");
