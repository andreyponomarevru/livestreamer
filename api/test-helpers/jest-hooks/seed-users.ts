import { beforeEach } from "@jest/globals";
import { createUsers } from "./utils/user";

// Execute before each test
beforeEach(createUsers);
