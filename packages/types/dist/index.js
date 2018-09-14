"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
exports.classUtils = {
    // This is useful for classes that have nested methods. Nested methods don't get bound out of the box.
    bindAll: function (self, exclude, thisArg) {
        if (exclude === void 0) { exclude = ["contructor"]; }
        for (var _i = 0, _a = Object.getOwnPropertyNames(self); _i < _a.length; _i++) {
            var key = _a[_i];
            var val = self[key];
            if (!_.includes(exclude, key)) {
                if (_.isFunction(val)) {
                    self[key] = val.bind(thisArg || self);
                }
                else if (_.isObject(val)) {
                    exports.classUtils.bindAll(val, exclude, self);
                }
            }
        }
        return self;
    },
};
var SolidityType;
(function (SolidityType) {
    SolidityType["address"] = "address";
    SolidityType["uint256"] = "uint256";
    SolidityType["uint8"] = "uint8";
    SolidityType["uint"] = "uint";
    SolidityType["bytes32"] = "bytes32";
    SolidityType["boolean"] = "bool";
    SolidityType["string"] = "string";
})(SolidityType = exports.SolidityType || (exports.SolidityType = {}));
//# sourceMappingURL=index.js.map