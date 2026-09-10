const express = require("express")
const inventario = require("./dados.json")

const app = express()
const porta = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const mostrarItens = (req, res) => {
    res.json(inventario)
}

const mostrarItem = (req, res) => {
    const id = req.params.id

    const item = inventario.find(i => i.id == id)

    if (item) {
        res.json(item)
    } else {
        res.status(404).json("Item não encontrado")
    }
}

const novoItem = (req, res) => {
    const dados = req.body

    let id = 1

    if (inventario.length > 0) {
        id = inventario[inventario.length - 1].id + 1
    }

    const item = {
        id: id,
        item: dados.item,
        local: dados.local,
        dataRegistro: dados.dataRegistro,
        valor: Number(dados.valor),
        patrimonio: dados.patrimonio
    }

    inventario.push(item)

    res.status(201).json(item)
}

const atualizarItem = (req, res) => {
    const id = req.params.id
    const dados = req.body

    const item = inventario.find(i => i.id == id)

    if (item) {
        item.item = dados.item
        item.local = dados.local
        item.dataRegistro = dados.dataRegistro
        item.valor = Number(dados.valor)
        item.patrimonio = dados.patrimonio

        res.json(item)
    } else {
        res.status(404).json("Item não encontrado")
    }
}

const excluirItem = (req, res) => {
    const id = req.params.id

    const indice = inventario.findIndex(i => i.id == id)

    if (indice != -1) {
        inventario.splice(indice, 1)

        res.json("Item excluído com sucesso")
    } else {
        res.status(404).json("Item não encontrado")
    }
}

const buscarItem = (req, res) => {
    const nome = req.query.nome

    const resultado = inventario.filter(i =>
        i.item.toLowerCase().includes(nome.toLowerCase())
    )

    res.json(resultado)
}

const filtrarLocal = (req, res) => {
    const local = req.query.local

    const resultado = inventario.filter(i =>
        i.local.toLowerCase().includes(local.toLowerCase())
    )

    res.json(resultado)
}

const itensAcima = (req, res) => {
    const valor = Number(req.query.valor)

    const resultado = inventario.filter(i =>
        i.valor > valor
    )

    res.json(resultado)
}

const verificarPatrimonio = (req, res) => {
    const patrimonio = req.query.patrimonio

    const item = inventario.find(i =>
        i.patrimonio == patrimonio
    )

    if (item) {
        res.json("Patrimônio já cadastrado")
    } else {
        res.json("Patrimônio disponível")
    }
}

const valorTotal = (req, res) => {
    let total = 0

    inventario.forEach(i => {
        total += i.valor
    })

    res.json({
        valorTotal: total
    })
}

app.post("/inventario", novoItem)
app.get("/inventario", mostrarItens)
app.get("/inventario/buscar", buscarItem)
app.get("/inventario/local", filtrarLocal)
app.get("/inventario/acima", itensAcima)
app.get("/inventario/patrimonio", verificarPatrimonio)
app.get("/inventario/total", valorTotal)
app.get("/inventario/:id", mostrarItem)
app.put("/inventario/:id", atualizarItem)
app.delete("/inventario/:id", excluirItem)

app.listen(porta, () => {
    console.log(`Servidor: http://127.0.0.1:${porta}`)
})