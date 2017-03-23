/**
 * @flow
 */

/*
 * Property Variance
 * Our stringLength function expect an object.
 * This object has a "p" property which is a "maybe string".
 * A "maybe string" can either be a string, a null, or an undefined.
 *
 * This function only return the string length if any. It doesn't mutate our object.
 */

function stringLengthA(o: {p: ?string}): number {
  return o.p ? o.p.length : 0;
}

const objectA : {p: ?string} = { p: "Hello !"};
const objectALength = stringLengthA(objectA); // All cool

/*
 * Everything worked out because the parameter signature ({p: ?string}) and the objectA signature are the same.
 * Now imagine our object has a string, and we are sure it is not going to be a null or undefined
 * value.
 */

const objectA2 : {p: string} = { p: "Hello !" };

/*
 * Flow knows objectA2.p must be a string and nothing else. And string is a subtype of ?string.
 * So calling stringLengthA on this object should work
 */

const objectA2Length = stringLengthA(objectA2); //!\\ Error : This type is incompatible with the expected param type of object type

/*
 * It doesn't work ! Why ?
 * Because our stringLengthA admits a "maybe string" (?string). Which means, for him, the string can be
 * a string, a null or undefined value. Internally it can mutate the object to set it to null or undefined, but
 * outside the function, the objectA2.p MUST be a string !
 * Flow forbid our function to do this but telling we've given it a wrong object.
 *
 * Alright. But our function stringLengthA is a reader : it doesn't mutate our string. Technically our code is
 * correct but flow is being preventive and alert us that what we're doing might end up badly.
 * But we can tell flow : "hey, we're just going to read this data, so even if the given object wants p to be
 * a string and nothing else, i wont touch it, i wont affect its correctness".
 *
 * We tell flow that our p is readOnly, or "covariant" (+).
 */

function stringLengthB(o: {+p: ?string}): number {
  return o.p ? o.p.length : 0;
}

const objectA2Length2 = stringLengthB(objectA2); // OK

/*
 * Okay now let's take a function that mutate our object. Like, an initializer
 */

function stringInitializerA(o: {p: string}): void {
  "use strict";
  o.p = "Hi !";
}

const objectA3 : {p: ?string} = { p: null };
stringInitializerA(objectA3); //!\\ Error : This type is incompatible with the expected param type of object type

/*
 * It doesn't work because our stringInitializerA expect a string, a good and nice-shaped string.
 * But.. we don't ever read it, so it doesn't matter at all wether or not it's a string, or a null.
 * We barely mutate it to some value that's independent from it.
 *
 * Our objectA3 property is a ?string, our function expect a string, and string <: ?string.
 * We can mutate our value as much as we now, it'll always be a subtype of ?string.
 * We can tell flow "so we're just going to mutate it, you don't care about what we put in it as long as it's
 * still a subtype of ?string",
 * and we do so by telling flow our p is writeOnly, or "contravariant" (-)
 */

function stringInitializerB(o: {-p: string}): void {
  "use strict";
  o.p = "Hi !";
}

stringInitializerB(objectA3); // OK