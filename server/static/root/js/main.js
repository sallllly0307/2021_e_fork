//本の名前　説明　表紙の画像
var network = null;
var nodes, edges;
nodes = new vis.DataSet();
var booksData = {};
nodes = new vis.DataSet();
edges = new vis.DataSet();

// create a network
var data = {
  nodes: nodes,
  edges: edges,
};

function destroy() {
  if (network !== null) {
    network.destroy();
    network = null;
  }
}

function draw() {
  destroy();
  // create a network
  var data = {
    nodes: nodes,
    edges: edges,
  };

  // create a network
  var container = document.getElementById("mynetwork");
  var options = {};
  reload();
  network = new vis.Network(container, data, options);
  network.on("click", function (params) {
    console.log(booksData[params.nodes[0]]);
  });
}

function clearPopUp() {
  document.getElementById("saveButton").onclick = null;
  document.getElementById("cancelButton").onclick = null;
  document.getElementById("network-popUp").style.display = "none";
}

function cancelEdit(callback) {
  clearPopUp();
  callback(null);
}

function saveData(data, callback) {
  data.id = document.getElementById("node-id").value;
  data.label = document.getElementById("node-label").value;
  clearPopUp();
  callback(data);
}
function OnbuttonClick() {
  var newId = (Math.random() * 1e7).toString(32);
  nodes.add({ id: newId, label: "I'm new!" });
}
function add(title, imagepath) {
  var newId = (Math.random() * 1e7).toString(32);
  nodes.add({ id: title, shape: "image", image: "imagepath" });
}

// 本を検索して結果を返す
async function searchBooks() {
  // Google Books APIs のエンドポイント
  var endpoint = "https://www.googleapis.com/books/v1";

  // 検索 API を叩く
  var res = await fetch(`${endpoint}/volumes?q=鬼滅`);
  // JSON に変換
  var data = await res.json();

  // 必要なものだけ抜き出してわかりやすいフォーマットに変更する
  var items = data.items.map((item) => {
    var vi = item.volumeInfo;
    return {
      title: vi.title,
      description: vi.description,
      link: vi.infoLink,
      image: vi.imageLinks ? vi.imageLinks.smallThumbnail : "",
    };
  });
  console.log(items);
  return items;
}

async function reload() {
  var books = await searchBooks();
  nodes.clear();
  for (const elem of books) {
    console.log(elem.title);
    var newId = (Math.random() * 1e7).toString(32);
    nodes.add({
      id: newId,
      shape: "image",
      image: elem.image,
      value: 20,
      label: elem.title,
    });
    booksData[newId] = elem;
  }
}
