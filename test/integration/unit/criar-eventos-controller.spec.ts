import { Request, Response } from "express";
import path from "path";
import { minLength, z } from 'zod';

//const req = {body: {email: ''}} as unknown as Request;

function mockResponse() {
    const res = {} as Partial<Response>;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response & {
        status: jest.Mock;
        json: jest.Mock;
    };
}

const req = {
    body: {
        titulo: "Festival Gastronômico do Centro",
        cat: "Gastronomia",
        data: "2025-09-20",
        hora: "18:00",
        local: "Rua Ponciano, Centro",
        preco: "Gratuito",
        img: "https://douradosagora.com.br/media/posts/390241/dourados-tera-neste-sabado-balaio-festival-com-musica-arte-gastronomia-e-cultura-17522582977313.jpg",
        desc: "Barracas, food trucks e música ao vivo com artistas locais."
    }
} as unknown as Request;

const criarEventoSchema = z.object({
    titulo: z.string().min(1, 'Título é obrigatório'),
    cat: z.string().min(1, 'Categoria é obrigatória'),
    data: z.date({error: 'Data inválida'}),
    hora: z.string().min(1, "Hora é obrigatória"),
    local: z.string().min(1, "Local é obrigatória"),
    preco: z.number().nonnegative("Preço deve ser um número não negativo"),
    img: z.url('Imagem deve ser uma URL válida'),
    desc: z.string().min(1, "Descrição é obrigatória"),
    });

    const listaEventos: any[] = [];

class CriarEventosController {
    async handle(req: Request, res: Response): Promise<Response> {

        try{
            const eventoData = criarEventoSchema.parse({
                titulo: req.body.titulo,
                cat: req.body.cat,
                data: new Date(req.body.data),
                hora: req.body.hora,
                local: req.body.local,
                preco: req.body.preco === 'Gratuito' ?0: parseFloat(req.body.preco),
                img: req.body.img,
                desc: req.body.desc,
            });
            listaEventos.push(eventoData);
            return res.status(201).json({message:'Evento criado com sucesso'});
        
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    message : "Validation error",
                    errors : error!.issues.map((err) =>({
                     path : err.path.join("."),
                     message: err.message,
                    })),
                });
            }
            
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}


//Suite de testes para criar criar-evento-controller.ts
describe('CriarEventosController', () => {

    //Testa um cenário exemplo.
    it('should create an instance', () => {

        //Exemplo simples de teste.
        expect(true).toBe(true);
    });

    it('should handle event creation', async () => {

        //Arrange do teste
        const controller = new CriarEventosController();
        const req = {
            body: {
                titulo: "Festival Gastronômico do Centro",
                cat: "Gastronomia",
                data: "2025-09-20",
                hora: "18:00",
                local: "Rua Ponciano, Centro",
                preco: "Gratuito",
                img: "https://douradosagora.com.br/media/posts/390241/dourados-tera-neste-sabado-balaio-festival-com-musica-arte-gastronomia-e-cultura-17522582977313.jpg",
                desc: "Barracas, food trucks e música ao vivo com artistas locais."
            }
        } as unknown as Request; //Mock da requisição
        const res = mockResponse();

        //Act
        await controller.handle(req, res);

        //Assert
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Evento criado com sucesso' })
    });


    it('should fail to create event whith invalid data', async () => {
        const controller = new CriarEventosController();
        const req = {
            body: {
                titulo: "", //Titulo inválido.                               
                cat: "",
                data: "20-25-09-20",
                hora: "",
                local: "",
                preco: "",
                img: "douradosagora.com.br@media/posts/390241/dourados-tera-neste-sabado-balaio-festival-com-musica-arte-gastronomia-e-cultura-17522582977313.jpg",
                desc: ""
            }
        } as unknown as Request; //Mock da requisição com dados iválidos.

        const res = mockResponse();

        await controller.handle(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ errors:[
            {
                message: "Título é obrigatório",
                path: "titulo",
            },

            {
                message: "Categoria é obrigatória",
                path: "cat",
            },

            {
                message: "Data inválida",
                path: "data",
            },

            {
                message: "Hora é obrigatória",
                path: "hora",
            },

            {
                message: "Local é obrigatória",
                path: "local",
            },

            {
                message: "Invalid input: expected number, received NaN",
                path: "preco",
            },

            {
                message: "Imagem deve ser uma URL válida",
                path: "img",
            },

            {
                message: "Descrição é obrigatória",
                path: "desc",
            },
        ],
    
    message: "Validation error",

        });
    });
});