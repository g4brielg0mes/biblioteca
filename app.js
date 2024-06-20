const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = 3000;

// Configuração do MongoDB
const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri);
const dbName = "biblioteca";
let db, livrosCollection;

async function conectarDB() {
    await client.connect();
    db = client.db(dbName);
    livrosCollection = db.collection('livros');
    await inserirDadosExemplo(); // Inserir dados de exemplo após conectar ao banco
}

conectarDB().catch(console.error);

// Middleware para analisar o corpo da requisição
app.use(express.json());

// Inserir um novo livro
app.post('/livros', async (req, res) => {
    const livro = req.body;
    await livrosCollection.insertOne(livro);
    res.status(201).send("Livro inserido com sucesso!");
});

// Atualizar dados de um livro existente
app.put('/livros/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    const livroAtualizado = req.body;
    await livrosCollection.updateOne({ ISBN: isbn }, { $set: livroAtualizado });
    res.send("Livro atualizado com sucesso!");
});

// Deletar um livro
app.delete('/livros/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    await livrosCollection.deleteOne({ ISBN: isbn });
    res.send("Livro deletado com sucesso!");
});

// Listar todos os livros de um determinado autor
app.get('/livros/autor/:autor', async (req, res) => {
    const autor = req.params.autor;
    const livros = await livrosCollection.find({ Autor: autor }).toArray();
    res.json(livros);
});

// Listar todos os livros de um determinado gênero
app.get('/livros/genero/:genero', async (req, res) => {
    const genero = req.params.genero;
    const livros = await livrosCollection.find({ Gênero: genero }).toArray();
    res.json(livros);
});

// Listar todos os livros publicados em um determinado ano
app.get('/livros/ano/:ano', async (req, res) => {
    const ano = parseInt(req.params.ano);
    const livros = await livrosCollection.find({ AnoPublicacao: ano }).toArray();
    res.json(livros);
});

// Listar os 10 livros com mais páginas
app.get('/livros/mais-paginas', async (req, res) => {
    const livros = await livrosCollection.find().sort({ Paginas: -1 }).limit(10).toArray();
    res.json(livros);
});

// Listar os 10 livros com menos páginas
app.get('/livros/menos-paginas', async (req, res) => {
    const livros = await livrosCollection.find().sort({ Paginas: 1 }).limit(10).toArray();
    res.json(livros);
});

// Buscar um livro pelo ISBN
app.get('/livros/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    const livro = await livrosCollection.findOne({ ISBN: isbn });
    res.json(livro);
});

// Inserir dados de exemplo
async function inserirDadosExemplo() {
    const livrosExemplo = [
        {"Titulo": "O Morro dos Ventos Uivantes", "Autor": "Emily Brontë", "AnoPublicacao": 1847, "Gênero": "Ficção Gótica", "Paginas": 416, "Sinopse": "Uma história de amor e vingança na fazenda de Wuthering Heights.", "ISBN": "9780141439556"},
        {"Titulo": "Orgulho e Preconceito", "Autor": "Jane Austen", "AnoPublicacao": 1813, "Gênero": "Romance", "Paginas": 279, "Sinopse": "Um romance que critica a sociedade inglesa do século XIX.", "ISBN": "9781503290563"},
        {"Titulo": "1984", "Autor": "George Orwell", "AnoPublicacao": 1949, "Gênero": "Distopia", "Paginas": 328, "Sinopse": "Uma história sobre vigilância governamental e totalitarismo.", "ISBN": "9780451524935"},
        {"Titulo": "Moby Dick", "Autor": "Herman Melville", "AnoPublicacao": 1851, "Gênero": "Aventura", "Paginas": 635, "Sinopse": "A viagem do baleeiro Pequod e seu capitão obsessivo, Ahab.", "ISBN": "9781503280786"},
        {"Titulo": "O Grande Gatsby", "Autor": "F. Scott Fitzgerald", "AnoPublicacao": 1925, "Gênero": "Tragédia", "Paginas": 180, "Sinopse": "Uma história sobre o sonho americano.", "ISBN": "9780743273565"},
        {"Titulo": "Guerra e Paz", "Autor": "Liev Tolstói", "AnoPublicacao": 1869, "Gênero": "Ficção Histórica", "Paginas": 1225, "Sinopse": "Um romance que narra a invasão da Rússia por Napoleão.", "ISBN": "9780199232765"},
        {"Titulo": "O Apanhador no Campo de Centeio", "Autor": "J.D. Salinger", "AnoPublicacao": 1951, "Gênero": "Ficção", "Paginas": 214, "Sinopse": "Um romance sobre a rebeldia e alienação adolescente.", "ISBN": "9780316769488"},
        {"Titulo": "O Hobbit", "Autor": "J.R.R. Tolkien", "AnoPublicacao": 1937, "Gênero": "Fantasia", "Paginas": 310, "Sinopse": "Uma fantasia sobre a jornada de Bilbo Bolseiro.", "ISBN": "9780547928227"},
        {"Titulo": "Crime e Castigo", "Autor": "Fiódor Dostoiévski", "AnoPublicacao": 1866, "Gênero": "Ficção Filosófica", "Paginas": 671, "Sinopse": "Um romance sobre a angústia mental de um ex-estudante pobre.", "ISBN": "9780486454115"},
        {"Titulo": "Os Irmãos Karamázov", "Autor": "Fiódor Dostoiévski", "AnoPublicacao": 1880, "Gênero": "Ficção Filosófica", "Paginas": 796, "Sinopse": "Um romance filosófico apaixonado ambientado na Rússia do século XIX.", "ISBN": "9780374528379"},
        {"Titulo": "Admirável Mundo Novo", "Autor": "Aldous Huxley", "AnoPublicacao": 1932, "Gênero": "Distopia", "Paginas": 311, "Sinopse": "Uma história sobre um estado mundial futurista.", "ISBN": "9780060850524"},
        {"Titulo": "Anna Kariênina", "Autor": "Liev Tolstói", "AnoPublicacao": 1878, "Gênero": "Romance", "Paginas": 864, "Sinopse": "Um romance sobre o amor trágico entre Anna Kariênina e Conde Vronski.", "ISBN": "9780143035008"},
        {"Titulo": "Jane Eyre", "Autor": "Charlotte Brontë", "AnoPublicacao": 1847, "Gênero": "Romance", "Paginas": 500, "Sinopse": "Um romance sobre a vida de Jane Eyre.", "ISBN": "9780141441146"},
        {"Titulo": "A Odisseia", "Autor": "Homero", "AnoPublicacao": -800, "Gênero": "Épico", "Paginas": 541, "Sinopse": "Um poema épico sobre as aventuras de Odisseu.", "ISBN": "9780140268867"},
        {"Titulo": "Frankenstein", "Autor": "Mary Shelley", "AnoPublicacao": 1818, "Gênero": "Ficção Científica", "Paginas": 280, "Sinopse": "Um romance sobre a criação de um monstro por Victor Frankenstein.", "ISBN": "9780486282114"},
        {"Titulo": "Fahrenheit 451", "Autor": "Ray Bradbury", "AnoPublicacao": 1953, "Gênero": "Distopia", "Paginas": 158, "Sinopse": "Uma história sobre uma sociedade futura onde os livros são proibidos.", "ISBN": "9781451673319"},
        {"Titulo": "O Sol é para Todos", "Autor": "Harper Lee", "AnoPublicacao": 1960, "Gênero": "Ficção", "Paginas": 324, "Sinopse": "Uma história sobre racismo e injustiça no sul dos Estados Unidos.", "ISBN": "9780061120084"},
        {"Titulo": "O Senhor dos Anéis: A Sociedade do Anel", "Autor": "J.R.R. Tolkien", "AnoPublicacao": 1954, "Gênero": "Fantasia", "Paginas": 423, "Sinopse": "A primeira parte da trilogia O Senhor dos Anéis.", "ISBN": "9780261102385"},
        {"Titulo": "O Conde de Monte Cristo", "Autor": "Alexandre Dumas", "AnoPublicacao": 1844, "Gênero": "Aventura", "Paginas": 1276, "Sinopse": "Uma história sobre as aventuras de Edmond Dantès.", "ISBN": "9780553213508"},
        {"Titulo": "Os Miseráveis", "Autor": "Victor Hugo", "AnoPublicacao": 1862, "Gênero": "Ficção Histórica", "Paginas": 1232, "Sinopse": "Uma história sobre a vida de Jean Valjean.", "ISBN": "9780451419438"},
        {"Titulo": "Alice no País das Maravilhas", "Autor": "Lewis Carroll", "AnoPublicacao": 1865, "Gênero": "Fantasia", "Paginas": 201, "Sinopse": "Uma história sobre as aventuras de Alice em um país maravilhoso.", "ISBN": "9780486275437"},
        {"Titulo": "As Aventuras de Sherlock Holmes", "Autor": "Arthur Conan Doyle", "AnoPublicacao": 1892, "Gênero": "Mistério", "Paginas": 307, "Sinopse": "Uma coleção de histórias de Sherlock Holmes.", "ISBN": "9780141034355"},
        {"Titulo": "Um Conto de Duas Cidades", "Autor": "Charles Dickens", "AnoPublicacao": 1859, "Gênero": "Ficção Histórica", "Paginas": 448, "Sinopse": "Um romance ambientado em Londres e Paris antes e durante a Revolução Francesa.", "ISBN": "9780141439600"},
        {"Titulo": "O Nome da Rosa", "Autor": "Umberto Eco", "AnoPublicacao": 1980, "Gênero": "Ficção Histórica", "Paginas": 512, "Sinopse": "Uma história de mistério ambientada em um mosteiro medieval.", "ISBN": "9780156001311"},
        {"Titulo": "Drácula", "Autor": "Bram Stoker", "AnoPublicacao": 1897, "Gênero": "Horror", "Paginas": 418, "Sinopse": "Uma história sobre o Conde Drácula e seu confronto com Jonathan Harker.", "ISBN": "9780486411095"},
        {"Titulo": "Madame Bovary", "Autor": "Gustave Flaubert", "AnoPublicacao": 1857, "Gênero": "Romance", "Paginas": 329, "Sinopse": "Uma história sobre Emma Bovary e suas tentativas de escapar da vida provinciana.", "ISBN": "9780140449129"},
        {"Titulo": "O Processo", "Autor": "Franz Kafka", "AnoPublicacao": 1925, "Gênero": "Ficção Surrealista", "Paginas": 304, "Sinopse": "Uma história sobre a luta de Josef K. contra uma burocracia opressiva.", "ISBN": "9780805209990"},
        {"Titulo": "A Metamorfose", "Autor": "Franz Kafka", "AnoPublicacao": 1915, "Gênero": "Ficção Surrealista", "Paginas": 201, "Sinopse": "Uma história sobre a transformação de Gregor Samsa em um inseto.", "ISBN": "9780805208726"},
        {"Titulo": "O Estrangeiro", "Autor": "Albert Camus", "AnoPublicacao": 1942, "Gênero": "Ficção Filosófica", "Paginas": 123, "Sinopse": "Uma história sobre a vida absurda e a indiferença de Meursault.", "ISBN": "9780679720201"},
        {"Titulo": "Ardil-22", "Autor": "Joseph Heller", "AnoPublicacao": 1961, "Gênero": "Sátira", "Paginas": 453, "Sinopse": "Uma história sobre as absurdidades da guerra.", "ISBN": "9781451626650"},
        {"Titulo": "O Velho e o Mar", "Autor": "Ernest Hemingway", "AnoPublicacao": 1952, "Gênero": "Ficção", "Paginas": 127, "Sinopse": "Uma história sobre a luta de um velho pescador com um grande peixe.", "ISBN": "9780684830490"},
        {"Titulo": "O Retrato de Dorian Gray", "Autor": "Oscar Wilde", "AnoPublicacao": 1890, "Gênero": "Ficção Filosófica", "Paginas": 254, "Sinopse": "Uma história sobre a beleza eterna e a corrupção moral.", "ISBN": "9780141439570"},
        {"Titulo": "Ulisses", "Autor": "James Joyce", "AnoPublicacao": 1922, "Gênero": "Ficção Modernista", "Paginas": 730, "Sinopse": "Uma narrativa do dia na vida de Leopold Bloom.", "ISBN": "9780141182803"},
        {"Titulo": "Cem Anos de Solidão", "Autor": "Gabriel García Márquez", "AnoPublicacao": 1967, "Gênero": "Realismo Mágico", "Paginas": 417, "Sinopse": "A saga da família Buendía em Macondo.", "ISBN": "9780307389732"},
        {"Titulo": "Lolita", "Autor": "Vladimir Nabokov", "AnoPublicacao": 1955, "Gênero": "Ficção", "Paginas": 336, "Sinopse": "Uma história sobre a obsessão de um homem por uma menina de 12 anos.", "ISBN": "9780141182537"},
        {"Titulo": "O Jardim Secreto", "Autor": "Frances Hodgson Burnett", "AnoPublicacao": 1911, "Gênero": "Literatura Infantil", "Paginas": 375, "Sinopse": "Uma história sobre a descoberta de um jardim mágico.", "ISBN": "9780141321066"},
        {"Titulo": "A Casa dos Espíritos", "Autor": "Isabel Allende", "AnoPublicacao": 1982, "Gênero": "Realismo Mágico", "Paginas": 448, "Sinopse": "Uma saga familiar com elementos de realismo mágico.", "ISBN": "9780553383805"}
    ];

    await livrosCollection.insertMany(livrosExemplo);
}

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

