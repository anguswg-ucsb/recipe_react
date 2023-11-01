// import React, { Component } from "react";
// import { useState } from "react";

// class SearchBar extends Component {
//   constructor() {
//     super();
//     this.state = {
//       textInput: "",
//     };
//   }
//   incrementWords = () => {
//     this.setState({ count: this.state.count + 1 });
//   };

//   render() {
//     return (
//       <div className="search-bar">
//         <input type="text" placeholder="Search..." />
//         <button type="button" className="btn btn-primary">
//           Search
//         </button>
//       </div>
//     );
//   }
// }
// class TrieNode extends Component {
//   // class TrieNode {
//   constructor() {
//     this.children = {};
//     this.endOfWord = false;
//   }
// }

// class Trie extends Component {
//   // class Trie {
//   constructor(words = []) {
//     this.root = new TrieNode();
//     this.suggestions = [];

//     // Insert the provided words into the Trie during initialization
//     for (const word of words) {
//       this.insert(word);
//     }
//   }

//   insert(word) {
//     let node = this.root;

//     for (const c of word) {
//       //   console.log("c: ", c);
//       if (!(c in node.children)) {
//         node.children[c] = new TrieNode();
//       }
//       node = node.children[c];
//     }

//     node.endOfWord = true;
//   }

//   search(word) {
//     let node = this.root;
//     for (const c of word) {
//       if (!(c in node.children)) {
//         return false;
//       }
//       node = node.children[c];
//     }

//     return node.endOfWord;
//   }

//   startsWith(prefix) {
//     let node = this.root;
//     for (const c of prefix) {
//       if (!(c in node.children)) {
//         return false;
//       }
//       node = node.children[c];
//     }
//     return true;
//   }
//   searchSuggestion(node, word, suggestions) {
//     if (node.endOfWord) {
//       suggestions.push(word);
//     }

//     for (const c in node.children) {
//       this.searchSuggestion(node.children[c], word + c, suggestions);
//     }
//   }
//   getSuggestions(key) {
//     let node = this.root;
//     let res = [];

//     for (const c of key) {
//       if (!(c in node.children)) {
//         return res;
//       }
//       node = node.children[c];
//     }

//     if (node.endOfWord) {
//       res.push(key);
//     }
//     this.searchSuggestion(node, key, res);

//     return res;
//   }

//   printSearchWord(node, word) {
//     if (node.endOfWord) {
//       console.log("word: ", word);
//     }

//     for (const c in node.children) {
//       this.printSearchWord(node.children[c], word + c);
//     }
//   }

//   printSuggestions(key) {
//     let node = this.root;

//     for (const c of key) {
//       if (!(c in node.children)) {
//         return 0;
//       }
//       node = node.children[c];
//     }

//     if (!node.children) {
//       return -1;
//     }
//     this.printSearchWord(node, key);
//     return 1;
//   }
// }

// const foodWords = [
//   "apple",
//   "banana",
//   "cherry",
//   "grape",
//   "strawberry",
//   "blueberry",
//   "orange",
//   "mango",
//   "watermelon",
//   "pineapple",
//   "kiwi",
//   "avocado",
//   "peach",
//   "pear",
//   "plum",
//   "lemon",
//   "lime",
//   "grapefruit",
//   "pomegranate",
//   "coconut",
//   "apricot",
//   "fig",
//   "nectarine",
//   "cantaloupe",
//   "honeydew",
//   "broccoli",
//   "carrot",
//   "potato",
//   "cucumber",
//   "eggplant",
//   "lettuce",
//   "pepper",
//   "tomato",
//   "zucchini",
//   "pumpkin",
//   "onion",
//   "garlic",
//   "celery",
//   "cabbage",
//   "cauliflower",
//   "spinach",
//   "strawberry",
//   "blueberry",
//   "raspberry",
//   "blackberry",
//   "cranberry",
//   "papaya",
//   "passionfruit",
//   "guava",
//   "starfruit",
// ];

// const prefix_tree = new Trie(foodWords);

// export default prefix_tree;

// #########################################
// #########################################

// export default Trie;

// const prefix_tree = new Trie(foodWords);
// console.log("prefix_tree: ", prefix_tree);
// console.log(
//   "prefix_tree.getSuggestions('a'): ",
//   prefix_tree.getSuggestions("a")
// );
// console.log(
//   "prefix_tree.getSuggestions('ap'): ",
//   prefix_tree.getSuggestions("ap")
// );
// console.log("prefix_tree.startsWith('r'): ", prefix_tree.startsWith("r"));
// console.log("prefix_tree.startsWith('bl'): ", prefix_tree.startsWith("bl"));

// export default Trie;

// const prefix_tree = new Trie();

// prefix_tree.insert("camel");
// prefix_tree.insert("cats");
// prefix_tree.insert("dogs");
// prefix_tree.insert("birds");
// prefix_tree.insert("doggy");
// prefix_tree.insert("docker");
// prefix_tree.search("doggy");
// prefix_tree.insert("zebra");
// prefix_tree.insert("dingo");
// prefix_tree.insert("zoomies");
// prefix_tree.insert("zoooo");
// prefix_tree.insert("chicken");
// prefix_tree.insert("chili");
// prefix_tree.insert("chips");
// prefix_tree.insert("chocolate");
// prefix_tree.insert("oranges");
// prefix_tree.insert("chickie");
// prefix_tree.insert("apple");
// prefix_tree.insert("banana");
// prefix_tree.insert("blueberry");
// prefix_tree.insert("carrot");
// prefix_tree.insert("dog");
// prefix_tree.insert("elephant");
// prefix_tree.insert("fish");
// prefix_tree.insert("grape");
// prefix_tree.insert("hamburger");
// prefix_tree.insert("icecream");
// prefix_tree.insert("jacket");
// prefix_tree.insert("kiwi");
// prefix_tree.insert("lemon");
// prefix_tree.insert("mango");
// prefix_tree.insert("noodles");
// prefix_tree.insert("octopus");
// prefix_tree.insert("pineapple");
// prefix_tree.insert("quokka");
// prefix_tree.insert("raspberry");
// prefix_tree.insert("strawberry");
// prefix_tree.insert("taco");
// prefix_tree.insert("umbrella");
// prefix_tree.insert("vanilla");
// prefix_tree.insert("watermelon");
// prefix_tree.insert("xylophone");
// prefix_tree.insert("yogurt");
// prefix_tree.insert("zeppelin");
// prefix_tree.insert("car");
// prefix_tree.insert("bus");
// prefix_tree.insert("train");
// prefix_tree.insert("zomba");
// prefix_tree.insert("zombie");
// prefix_tree.insert("zocky");
// console.log(
//   'prefix_tree.getSuggestions("c"): ',
//   prefix_tree.getSuggestions("c")
// );
// console.log(
//   'prefix_tree.getSuggestions("ch"): ',
//   prefix_tree.getSuggestions("ch")
// );
// console.log(
//   'prefix_tree.getSuggestions("chi"): ',
//   prefix_tree.getSuggestions("chi")
// );
// console.log(
//   'prefix_tree.getSuggestions("chic"): ',
//   prefix_tree.getSuggestions("chic")
// );
// console.log(
//   'prefix_tree.getSuggestions("chick"): ',
//   prefix_tree.getSuggestions("chick")
// );

// console.log(
//   'prefix_tree.getSuggestions("z"): ',
//   prefix_tree.getSuggestions("z")
// );
// console.log(
//   'prefix_tree.getSuggestions("zo"): ',
//   prefix_tree.getSuggestions("zo")
// );
// console.log(
//   'prefix_tree.getSuggestions("zoo"): ',
//   prefix_tree.getSuggestions("zoo")
// );
// console.log(
//   'prefix_tree.getSuggestions("zoom"): ',
//   prefix_tree.getSuggestions("zoom")
// );
// console.log(
//   'prefix_tree.getSuggestions("zoomi"): ',
//   prefix_tree.getSuggestions("zoomi")
// );

// prefix_tree.startsWith("dog");
// console.log("search dog BEFORE INSERT: : ", prefix_tree.search("dog"));
// prefix_tree.insert("dog");
// console.log("search dog AFTER INSERT: ", prefix_tree.search("dog"));

// console.log("butts: ", prefix_tree.search("butts"));
// console.log("startsWith dog: ", prefix_tree.startsWith("dog"));
// console.log("startsWith cam: ", prefix_tree.startsWith("cam"));
// console.log("startsWith zoooo: ", prefix_tree.startsWith("zoooo"));
// console.log("startsWith bi: ", prefix_tree.startsWith("biz"));

// console.log("startsWith bi: ", prefix_tree.startsWith("biz"));
// prefix_tree.printSuggestions("do");
// prefix_tree.printSuggestions("chi");
