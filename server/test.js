// return a string in the format YYYY-MM-DD given a date in the formats MM/DD/YYYY, M/D/YYYY, MM/DD/YY, M/D/YY

function formatDate(dateInput) {
  // const date = new Date(dateInput);
  // const year = date.getFullYear();
  // const month = ("0" + (date.getMonth() + 1)).slice(-2);
  // const day = ("0" + date.getDate()).slice(-2);

  // const formattedDate = year + "-" + month + "-" + day;

  // console.log(formattedDate);

  let date = new Date(dateInput);
  let formattedDate = date.toISOString().slice(0, 10);

  console.log("\nFormatted Date:", formattedDate);
  return formattedDate;
}
formatDate("12/30/1997");
formatDate("8/6/2023");
formatDate("05/2/2013");
formatDate("3/17/1888");

(function () {
  if (false) {
    let f = { g: () => 1 };
  }
  console.log(typeof f);
  return typeof f;
});
console.log("\nTypeof:", typeof f);
