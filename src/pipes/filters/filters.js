var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Pipe } from '@angular/core';
/**
 * Generated class for the FiltersPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
var FiltersPipe = /** @class */ (function () {
    function FiltersPipe() {
    }
    /**
     * Takes a value and makes it lowercase.
     */
    FiltersPipe.prototype.transform = function (value) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return value.toLowerCase();
    };
    FiltersPipe = __decorate([
        Pipe({
            name: 'filters',
        })
    ], FiltersPipe);
    return FiltersPipe;
}());
export { FiltersPipe };
var OrderByPipe = /** @class */ (function () {
    function OrderByPipe() {
    }
    OrderByPipe_1 = OrderByPipe;
    OrderByPipe.compare = function (reverse, a, b) {
        if (a < b && reverse === false) {
            return -1;
        }
        if (a > b && reverse === false) {
            return 1;
        }
        if (a < b && reverse === true) {
            return 1;
        }
        if (a > b && reverse === true) {
            return -1;
        }
        return 0;
    };
    OrderByPipe.prototype.transform = function (input, config) {
        if (!input) {
            return input;
        }
        if (config === '+' || config === '-') {
            return config === '+' ? input.sort() : input.sort().reverse();
        }
        if (Array.isArray(config) === false) {
            config = [config];
        }
        // As soon as a or b is smaller/greater than the other, we can immediately return
        return input.sort(function (a, b) {
            for (var _i = 0, config_1 = config; _i < config_1.length; _i++) {
                var fullProp = config_1[_i];
                var reverse = fullProp[0] === '-';
                var prop = fullProp.substr(1);
                // Is it a subobject?
                if (prop.indexOf('.') > 0) {
                    var first = prop.split('.')[0];
                    var last = prop.split('.')[1];
                    var result_1 = OrderByPipe_1.compare(reverse, a[first][last], b[first][last]);
                    if (result_1 !== 0) {
                        return result_1;
                    }
                    continue;
                }
                var result = OrderByPipe_1.compare(reverse, a[prop], b[prop]);
                if (result !== 0) {
                    return result;
                }
            }
            ;
            return 0;
        });
    };
    var OrderByPipe_1;
    OrderByPipe = OrderByPipe_1 = __decorate([
        Pipe({ name: 'orderByVal' })
    ], OrderByPipe);
    return OrderByPipe;
}());
export { OrderByPipe };
//# sourceMappingURL=filters.js.map