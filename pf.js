function Condition(condition, value) {
  var self = arguments.callee;
  var Condition = {'condition': condition, 'value': value};
  Condition.__proto__ = self.prototype;
  return Condition;
}
Condition.prototype.toString = function toString() {
  return "Condition(" + this.condition + ", " + this.value + ")";
}

function PF() {
  var self = arguments.callee;
  
  var PF = function PF(condition) {
    if (condition == undefined) {
      throw new Error("Partial function must be called at a location");
    }
    
    for (var k = 0; k < PF.conditionsArray.length; k++) {
      if (PF.conditionsArray[k].condition == condition) {
        return PF.conditionsArray[k].value();
      }
    }
    
    // if we haven't hit a match then it's undefined
    throw new Error("Partial function is undefined at location " + condition);
  }
  
  PF.conditionsArray = []; // Array.prototype.slice.call(arguments)
  for (var k = 0; k < arguments.length; k++) {
    if (arguments[k] instanceof Condition) {
      PF.conditionsArray.push(arguments[k]);
    } else {
      throw new Error("Partial function can only be constructed of Condition objects");
    }
  }
  
  PF.conditions = function conditions() {
    return this.conditionsArray.map(function(item) { return item.condition; });
  }
  
  PF.isDefinedAt = function isDefinedAt(condition) {
    return (this.conditions().indexOf(condition) > -1);
  }
  
  PF.orElse = function orElse(altPF) {
    var firstCond = this.conditionsArray[0];
    var newPF = self(firstCond);
    newPF.conditionsArray = newPF.conditionsArray.concat(this.conditionsArray.slice(1))
    newPF.conditionsArray = newPF.conditionsArray.concat(altPF.conditionsArray)
    return newPF;
  }
  
  PF.__proto__ = self.prototype;

  return PF;
}