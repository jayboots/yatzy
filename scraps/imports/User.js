let userCount = 0

export class User {
  constructor(name, age) {
    this.name = name
    this.age = age
    userCount++
  }
}

export function printName(user) {
  console.log(`User has the name ${user.name}`)
}

export function printAge(user) {
  console.log(`${user.name} is ${user.age} years old`)
}