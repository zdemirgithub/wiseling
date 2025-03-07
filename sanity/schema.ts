import { type SchemaTypeDefinition } from "sanity";
import { courseType } from "./schemaTypes/courseType";
import { moduleType } from "./schemaTypes/moduleType";
import { lessonType } from "./schemaTypes/lessonType";
import { instructorType } from "./schemaTypes/instructorType";
import { studentType } from "./schemaTypes/studentType";
import { enrollmentType } from "./schemaTypes/enrollmentType";
import { categoryType } from "./schemaTypes/categoryType";
import { lessonCompletionType } from "./schemaTypes/lessonCompletionType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    courseType,
    moduleType,
    lessonType,
    instructorType,
    studentType,
    enrollmentType,
    categoryType,
    lessonCompletionType,
  ],
};
