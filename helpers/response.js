exports.result = result;
function result(data , success, message) {
    var result = {};
    result["data"] = data;
    result["success"] = success;
    result["message"] = message;
    return result; 
}