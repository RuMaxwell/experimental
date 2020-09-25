"use strict";
var MonadBind = /** @class */ (function () {
    function MonadBind(binding) {
        var _a;
        if (~binding.indexOf('<-')) {
            _a = binding.split('<-').map(function (x) { return x.trim(); }), this.bindName = _a[0], this.boundMonad = _a[1];
        }
        else {
            this.bindName = '';
            this.boundMonad = binding;
        }
    }
    return MonadBind;
}());
function bind(binding) {
    return new MonadBind(binding);
}
function ret(monad) {
    return monad;
}
function Do() {
    var tasks = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        tasks[_i] = arguments[_i];
    }
    var s = '';
    for (var i = 0; i < tasks.length; i++) {
        var task = tasks[i];
        if (task instanceof MonadBind) {
            s += "(" + task.boundMonad + ").bind(" + task.bindName + " =>\n";
        }
        else {
            s += task;
        }
    }
    for (var i = 0; i < tasks.length; i++) {
        s += ')';
    }
    console.log(s);
    return eval(s);
}
var Result = /** @class */ (function () {
    function Result() {
    }
    Result.Ok = function (value) {
        var r = new Result();
        r.value = value;
        return r;
    };
    Result.Err = function (error) {
        var r = new Result();
        r.error = error;
        return r;
    };
    Object.defineProperty(Result.prototype, "isError", {
        get: function () {
            return this.error !== undefined;
        },
        enumerable: false,
        configurable: true
    });
    Result.prototype.unwrap = function () {
        if (this.isError) {
            throw new Error("" + this.error);
        }
        return this.value;
    };
    Result.prototype.except = function (msg) {
        if (this.isError) {
            throw new Error(msg);
        }
        return this.value;
    };
    Result.prototype.bind = function (andThen) {
        if (this.isError) {
            return Result.Err(this.error);
        }
        return andThen(this.value);
    };
    Result.ret = function (value) {
        return Result.Ok(value);
    };
    Result.prototype.show = function () {
        if (this.isError) {
            return "Err(" + this.error + ")";
        }
        return "Ok(" + this.value + ")";
    };
    return Result;
}());
var Account = /** @class */ (function () {
    function Account() {
        this.balance = 0;
    }
    Account.prototype.update = function (balance) {
        if (balance < 0) {
            return Result.Err('invalid balance');
        }
        this.balance = balance;
        return Result.Ok(this);
    };
    Account.prototype.add = function (amount) {
        var rest = this.balance + amount;
        if (rest < 0) {
            return Result.Err('invalid balance');
        }
        this.balance = rest;
        return Result.Ok(this);
    };
    Account.prototype.show = function () {
        return "Account(" + this.balance + ")";
    };
    return Account;
}());
var IO = /** @class */ (function () {
    function IO(value) {
        this.value = value;
    }
    IO.prototype.bind = function (andThen) {
        return andThen(this.value);
    };
    IO.ret = function (value) {
        return new IO(value);
    };
    IO.prototype.show = function () {
        return "IO(" + this.value + ")";
    };
    return IO;
}());
function printIt(o) {
    console.log(o.show());
    return IO.ret(undefined);
}
(function Test() {
    var account = new Account().update(50)
        .bind(function (a) { return a.add(-20)
        .bind(function (a) { return a.add(10)
        .bind(function (a) { return a.add(-40)
        .bind(function (a) { return a.add(20); }); }); }); });
    Do(bind('a <- new Account().update(50)'), bind('a <- a.add(-20)'), bind('a <- a.add(10)'), bind('a <- a.add(-40)'), ret('a.add(20'));
    console.log(account.bind(function (a) { return printIt(a); }));
})();
