import User "types";
import Array "mo:base/Array";
import RBTree "mo:base/RBTree";
import Text "mo:base/Text";
import Blob "mo:base/Blob";
import Result "mo:base/Result";
import Float "mo:base/Float";

actor Main {

  let tree = RBTree.RBTree<Text, User.User>(Text.compare);
  stable var loginPrincipalID : Text = "";
  type Result<T, E> = { #ok : T; #err : E };

  public func storePrincipalID(principal_id : Text) : async () {
    loginPrincipalID := principal_id;
  };

  public func deleteUser(principal_id : Text) : async () {
    tree.delete(principal_id);
  };

  public func getPrincipalID() : async (Text) {
    return loginPrincipalID;
  };

  public func clearPrincipalID() : async () {
    loginPrincipalID := "";
  };

  private func validateRegister(username : Text, email : Text, profilePic : Blob) : Result<Null, Text> {
    if (email == "") {
      return #err("Email can't be empty");
    };

    for (entry in RBTree.iter(tree.share(), #bwd)) {
      if (entry.1.email == email) {
        return #err("Email must be unique");
      };
    };

    if (username == "") {
      return #err("Username can't be empty");
    };

    if (profilePic.size() == 0) {
      return #err("Profile picture can't be empty");
    };

    return #ok(null);
  };

  public func register(principal_id : Text, username : Text, email : Text, profilePic : Blob) : async Result<Text, Text> {
    switch (validateRegister(username, email, profilePic)) {
      case (#err(errMsg)) {
        return #err(errMsg);
      };
      case (#ok(_)) {
        let newUser : User.User = {
          principal_id = principal_id;
          username = username;
          email = email;
          money = 500;
          profilePic = profilePic;
        };
        tree.put(principal_id, newUser);
        return #ok("User registered successfully");
      };
    };
  };

  public func getAllUsers() : async [User.User] {
    var users : [User.User] = [];

    for (entry in RBTree.iter(tree.share(), #bwd)) {
      users := Array.append<User.User>(users, [entry.1]);
    };

    return users;
  };

  public func reduceUserBalance(principal_id : Text, amount : Float) : async Result<Null, Text> {

    for (e in RBTree.iter(tree.share(), #bwd)) {
      let key = e.0;
      let user = e.1;

      if (key == principal_id) {

        if (amount > user.money) {
          return #err("Insufficient balance");
        };

        let updatedUser : User.User = {
          principal_id = user.principal_id;
          username = user.username;
          email = user.email;
          money = user.money - amount;
          profilePic = user.profilePic;
        };

        tree.put(key, updatedUser);
      };
    };

    return #ok(null);
  };

  public func addUserBalance(principal_id : Text, amount : Float) {

    for (e in RBTree.iter(tree.share(), #bwd)) {
      let key = e.0;
      let user = e.1;

      if (key == principal_id) {

        let updatedUser : User.User = {
          principal_id = user.principal_id;
          username = user.username;
          email = user.email;
          money = user.money + amount;
          profilePic = user.profilePic;
        };

        tree.put(key, updatedUser);
      };
    };

  };


  public func login(principal_id : Text) : async ?User.User {
    let user = tree.get(principal_id);
    return user;
  };

  public func updateProfile(principal_id : Text, new_username : Text, new_profilePic : Blob) : async Result<Text, Text> {
    if (new_username == "") {
      return #err("Username can't be empty");
    };

    if (new_profilePic.size() == 0) {
      return #err("Profile picture can't be empty");
    };

    let userOpt = tree.get(principal_id);
    switch (userOpt) {
      case (null) {
        return #err("User not found");
      };
      case (?user) {
        let updatedUser : User.User = {
          principal_id = user.principal_id;
          username = new_username;
          email = user.email;
          money = user.money;
          profilePic = new_profilePic;
        };

        tree.put(principal_id, updatedUser);
        return #ok("Profile updated successfully");
      };
    };
  };

};
