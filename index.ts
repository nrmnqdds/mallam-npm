import { Mallam } from "./services/mallam";

// const mallam = new Mallam(
//   'apikey',
//   {
//     top_k: 5,
//     top_p: 1000
//   }
// );

// const main = async () => {
//   const res = await mallam.generatePrompt("berapa average harga rumah di jakarta?")
//   console.log(res)
// }
//
// main()

module.exports = Mallam;
