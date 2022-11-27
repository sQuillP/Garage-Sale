
/**
 * re-cast date object into a new date and add an offset
 *  return the floored date for mongoDB to process date filtration.
 */
module.exports = function(date,offset){
    const newDate = new Date(date)
    return new Date(newDate.getFullYear(),newDate.getMonth(), newDate.getDate()+offset).getTime();
}