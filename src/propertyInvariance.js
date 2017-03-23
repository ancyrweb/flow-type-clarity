/**
 * @flow
 */

/*
 * Lets first talk about property invariant.
 * "Object types are invariant with respect to their object properties type".
 *
 * Lets take
 * Type O1 = {p: T1}
 * Type O2 = {p: T2}
 * We'll use B <: A to describe B is a subtype of A.
 *
 * The rule for object types is the following
 * O2 <: O1 if T1 <: T2 AND T2 <: T1
 *
 * Basically, object follow structural typing.
 * An object B can be used a subtype of object A if object B have all the properties of object A.
 *
 * They talk about subtyping but it's more about interchangeability.
 */

type typeWithoutNumber1 = { p: string };
type typeWithNumber1 = { a: number, p: string };

function lengthTypeWithoutNumber1(object: typeWithoutNumber1){
  "use strict";
  return object.p.length;
}

const objectA1: typeWithoutNumber1 = { p: "Hello" };
const objectB1: typeWithNumber1 = { a: 10, p: "Hello" };

const objectA1Size = lengthTypeWithoutNumber1(objectA1); // OK
const objectB1Size = lengthTypeWithoutNumber1(objectB1); // OK

/*
 * It work because typeWithNumber has all the properties of typeWithoutNumber.
 *
 * Now, let's consider that string is a subtype of ?string.
 * This mean when we see a ?string, we can TECHNICALLY replace it by a string.
 */

type typeWithoutNumber2 = { p: ?string };
type typeWithNumber2 = { a: number, p: string };

function lengthTypeWithoutNumber2(object: typeWithoutNumber2){
  "use strict";
  return object.p && object.p.length;
}

const objectA2: typeWithoutNumber2 = { p: "Hello" };
const objectB2: typeWithNumber2 = { a: 10, p: "Hello" };

const objectA2Size = lengthTypeWithoutNumber2(objectA2); // OK
const objectB2Size = lengthTypeWithoutNumber2(objectB2); //!\\ It doesn't :((

/*
 * Our ObjectB2Size doesn't want to work !
 * But it has a string for certain, while our function expect either a string, or null, or undefined !
 *
 * This is because we're talking about objects, and object properties are mutable. What if our function,
 * which is dealing with a ?string, wants to assign our parameter to null ? It would be a disaster outside
 * of the function because objectB2Size wants a string !
 *
 * Ok wait, now if we invert, for fun ?
 */

type typeWithoutNumber3 = { p: string };
type typeWithNumber3 = { a: number, p: ?string };

function lengthTypeWithoutNumber3(object: typeWithoutNumber3){
  "use strict";
  return object.p && object.p.length;
}

const objectA3: typeWithoutNumber3 = { p: "Hello" };
const objectB3: typeWithNumber3 = { a: 10, p: "Hello" };

const objectA3Size = lengthTypeWithoutNumber3(objectA3); // OK
const objectB3Size = lengthTypeWithoutNumber3(objectB3); //!\\ It doesn't :((

/*
 * Now it's easier to understand why it wont work out.
 * ObjectB3 can either be a string, a null, or an undefined value. But our function
 * expect a typeWithoutNumber3 whose "p" value is a string, for sure.
 *
 * There can be subtyping between object (i mean, interchangeability) if their interface are the same.
 * By same, i mean exactly the same, there can't be inheritance between properties. Because we are dealing
 * with objects, and properties can be mutated from a local context.
 *
 * We say that object types are invariant with respect to their property types.
 */