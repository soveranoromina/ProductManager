import { ProductModel } from "../database/models/ProductModel.js"
import { connection } from "../database/MongoDBConnection.js";

class SeedProducts {
  constructor() {
    this.products = [
      {
        "title": "Pan Integral",
        "description": "Pan integral recién horneado",
        "code": "A1",
        "price": 120,
        "status": true,
        "stock": 30,
        "category": "Alimentos",
        "thumbnails": ["pan_integral.png"]
      },
      {
        "title": "Arroz Blanco",
        "description": "Arroz de grano largo fino",
        "code": "A2",
        "price": 90,
        "status": true,
        "stock": 50,
        "category": "Alimentos",
        "thumbnails": ["arroz.png"]
      },
      {
        "title": "Fideos Spaghetti",
        "description": "Pasta seca tipo spaghetti",
        "code": "A3",
        "price": 110,
        "status": true,
        "stock": 40,
        "category": "Alimentos",
        "thumbnails": ["fideos.png"]
      },

      {
        "title": "Agua Mineral",
        "description": "Agua mineral sin gas 1.5L",
        "code": "B1",
        "price": 60,
        "status": true,
        "stock": 100,
        "category": "Bebidas",
        "thumbnails": ["agua.png"]
      },
      {
        "title": "Jugo de Naranja",
        "description": "Jugo natural de naranja 1L",
        "code": "B2",
        "price": 85,
        "status": true,
        "stock": 70,
        "category": "Bebidas",
        "thumbnails": ["jugo_naranja.png"]
      },
      {
        "title": "Gaseosa Cola",
        "description": "Bebida cola 2.25L",
        "code": "B3",
        "price": 150,
        "status": true,
        "stock": 90,
        "category": "Bebidas",
        "thumbnails": ["gaseosa.png"]
      },

      {
        "title": "Jabón de Tocador",
        "description": "Jabón de tocador neutro",
        "code": "H1",
        "price": 45,
        "status": true,
        "stock": 200,
        "category": "Higiene",
        "thumbnails": ["jabon.png"]
      },
      {
        "title": "Shampoo Herbal",
        "description": "Shampoo con extractos naturales",
        "code": "H2",
        "price": 180,
        "status": true,
        "stock": 60,
        "category": "Higiene",
        "thumbnails": ["shampoo.png"]
      },
      {
        "title": "Pasta Dental",
        "description": "Crema dental fluorada 90g",
        "code": "H3",
        "price": 95,
        "status": true,
        "stock": 120,
        "category": "Higiene",
        "thumbnails": ["pasta_dental.png"]
      },

      {
        "title": "Lavandina",
        "description": "Lavandina desinfectante 2L",
        "code": "L1",
        "price": 70,
        "status": true,
        "stock": 150,
        "category": "Limpieza",
        "thumbnails": ["lavandina.png"]
      },
      {
        "title": "Detergente Líquido",
        "description": "Detergente concentrado 750ml",
        "code": "L2",
        "price": 95,
        "status": true,
        "stock": 130,
        "category": "Limpieza",
        "thumbnails": ["detergente.png"]
      },
      {
        "title": "Perfumol",
        "description": "Perfumol desinfectante",
        "code": "L3",
        "price": 80,
        "status": true,
        "stock": 13,
        "category": "Limpieza",
        "thumbnails": ["perfumol.png"]
      },

      {
        "title": "Labial Rojo",
        "description": "Labial rojo intenso mate",
        "code": "C1",
        "price": 250,
        "status": true,
        "stock": 40,
        "category": "Cosmetica",
        "thumbnails": ["labial.png"]
      },
      {
        "title": "Base Líquida",
        "description": "Base líquida para maquillaje tono natural",
        "code": "C2",
        "price": 320,
        "status": true,
        "stock": 35,
        "category": "Cosmetica",
        "thumbnails": ["base.png"]
      },
      {
        "title": "Delineador Negro",
        "description": "Delineador líquido negro waterproof",
        "code": "C3",
        "price": 180,
        "status": true,
        "stock": 50,
        "category": "Cosmetica",
        "thumbnails": ["delineador.png"]
      },

      {
        "title": "Camiseta Básica",
        "description": "Camiseta de algodón unisex",
        "code": "R1",
        "price": 400,
        "status": true,
        "stock": 60,
        "category": "Ropa",
        "thumbnails": ["camiseta.png"]
      },
      {
        "title": "Pantalón Jeans",
        "description": "Pantalón de jeans azul clásico",
        "code": "R2",
        "price": 1200,
        "status": true,
        "stock": 25,
        "category": "Ropa",
        "thumbnails": ["jeans.png"]
      },
      {
        "title": "Campera Deportiva",
        "description": "Campera deportiva liviana",
        "code": "R3",
        "price": 2200,
        "status": true,
        "stock": 15,
        "category": "Ropa",
        "thumbnails": ["campera.png"]
      },

      {
        "title": "Pelota de Fútbol",
        "description": "Pelota de fútbol tamaño 5",
        "code": "J1",
        "price": 950,
        "status": true,
        "stock": 20,
        "category": "Juguetes",
        "thumbnails": ["pelota.png"]
      },
      {
        "title": "Muñeca Clásica",
        "description": "Muñeca articulada con vestido",
        "code": "J2",
        "price": 750,
        "status": true,
        "stock": 18,
        "category": "Juguetes",
        "thumbnails": ["muneca.png"]
      },
      {
        "title": "Bloques Didácticos",
        "description": "Caja de bloques de construcción 100 piezas",
        "code": "J3",
        "price": 1150,
        "status": true,
        "stock": 12,
        "category": "Juguetes",
        "thumbnails": ["bloques.png"]
      }
    ]
  }

  async insertSeed() {
    try {
      await ProductModel.deleteMany({})
      await ProductModel.insertMany(this.products)
      console.log("✅ Productos seed insertados correctamente")
    } catch (error) {
      console.error("Error al insertar seed:", error)
    }
  }
}

async function runSeed() {
  try {
    await connection.initMongoDB()
    const seed = new SeedProducts()
    await seed.insertSeed()
    console.log("Seed ejecutado correctamente")
  } catch (err) {
    console.error(err)
  } finally {
    process.exit(0)
  }
}

runSeed()

