Estou finalizando um projeto de um sistema para uma transportadora de gado.
A ideia principal do sistema é gerar e controlar relatórios de viagens, despesas e abastecimentos dos caminhões. Já implementei a maior parte do projeto, mas quero realizar alguns ajustes, correções e melhorias com seu auxílio.
Tecnologias utilizadas no projeto:

* Backend: Spring Boot com Java
* Banco de dados: PostgreSQL dentro de um container Docker
* Existe um arquivo Docker Compose no projeto para configurar o banco
* Frontend: HTML, JavaScript e alguns modelos prontos do Bootstrap
Quero que você me ajude com bastante cuidado, seguindo estas regras:

1. Antes de sugerir qualquer alteração importante, analise bem o contexto do projeto.
2. Não invente arquivos, classes, tabelas, endpoints ou funcionalidades que eu não tenha informado ou enviado.
3. Se faltar alguma informação, pergunte antes de responder ou antes de propor uma solução.
4. Quando eu enviar algum código, primeiro entenda o que ele faz antes de sugerir mudanças.
5. Não reescreva partes grandes do projeto sem necessidade.
6. Prefira ajustes pontuais, bem explicados e compatíveis com o que já existe.
7. Sempre que for sugerir uma alteração, explique:
   * qual é o problema;
   * por que a mudança é necessária;
   * onde a mudança deve ser feita;
   * qual código deve ser alterado ou adicionado.
8. Se houver mais de uma forma de resolver, me mostre as opções e diga qual você recomenda.
9. Não assuma nomes de tabelas, colunas, DTOs, repositories, services ou controllers sem confirmar no código que eu enviar.
10. Se a solução depender da estrutura atual do projeto, peça para eu enviar os arquivos necessários antes.
11. Pense passo a passo antes de responder, mas me mostre apenas a resposta final de forma clara e objetiva.
12. Priorize manter o projeto simples, organizado e funcional.
13. "direto ao ponto", "só o fato", "sem perâmbulo"
14. "Me de a melhor resposta gastando o mínimo de token possível"
A partir de agora, vou te enviar os arquivos, erros ou ajustes que quero fazer. Me ajude como se estivesse revisando um projeto real, com cuidado para não quebrar o que já está funcionando.

A funcionalidade que quero implementar agora é adicionar um filtro por motorista e um pela placa do caminhão na tela de listar viagem, esse filtro tem que ser junto com o filtro de data. 

Exemplo: Quero as viagens do motorista x nos dias xx/xx/xxxx a xx/xx/xxxx ou Quero as viagens do caminhao da placa xxx-xxxx nos dias xx/xx/xxxx a xx/xx/xxxx

Vou te mandar meu front-end ligado a tela de viagem e o beck-end


<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Viagens Cadastrada</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="/css/listar_viagem.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
  <style>
    /* mantém cada célula em uma linha só; a tabela rola na horizontal se precisar */
    #tabelaViagens td, .table thead th { white-space: nowrap; vertical-align: middle; }
  </style>
</head>
<body class="bg-light">
  <header id="menu-container"></header>
  
  <div class="container mt-4">
    <h2 class="h4 mb-3">Relatório de Viagens</h2>

      <div class="card mb-4">
            <div class="card-body">

                <h5 class="card-title mb-3">Filtrar Viagens</h5>

                <form>
                <div class="row g-3 align-items-end">

                    <div class="col-md-4">
                    <label for="dataInicioFiltro" class="form-label">Data Início</label>
                    <input type="date" id="dataInicio" class="form-control" required>
                    </div>

                    <div class="col-md-4">
                    <label for="dataFimFiltro" class="form-label">Data Fim</label>
                    <input type="date" id="dataFim" class="form-control" required>
                    </div>

                    <div class="col-md-4 d-flex gap-2 align-items-end">
                    <button type="submit" class="btn btn-success" id="btnFiltrar">
                        Filtrar
                    </button>
                    <button type="button" class="btn btn-secondary" id="btnLimpar">Limpar</button>
                    <button type="button" class="btn btn-danger" id="btnPdf" title="Baixar PDF do período">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style="vertical-align:-2px;">
                          <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                          <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                        </svg>
                        PDF
                    </button>
                    
                    </div>

                </div>
                </form>

            </div>
            </div>

      <div class="table-responsive">
      <table class="table table-bordered table-hover align-middle tabela-viagens">
        <thead class="table-secondary">
          <tr>
            <th>Responsavel</th>
            <th>Transportadora</th>
            <th>Motorista</th>
            <th>Placa</th>
            <th>Origem</th>
            <th>Destino</th>
            <th>Animais</th>
            <th>Embarque</th>
            <th>Km</th>
            <th>R$ Km</th>
            <th>Pedágios</th>
            <th>Adiantamento</th>
            <th>Total</th>
            <th class="text-center">Condição</th>
            <th class="text-center">Ações</th>
          </tr>
        </thead>
        <tbody id="tabelaViagens">
          <!-- Linhas via JS -->
        </tbody>
      </table>
    </div>

    <div class="mt-3 d-flex justify-content-between align-items-center">
      <a href="cadastro_viagem.html" class="btn btn-primary">Cadastrar nova Viagem</a>
      <div id="faturamentoViagens" class="h5 mb-0 fw-bold text-success" style="display: none;">
        Faturamento Viagens: R$ 0,00
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/jspdf-autotable@3.8.2/dist/jspdf.plugin.autotable.min.js"></script>
  <script src="../../js/viagem.js"></script>
  <script src="../../js/menu.js"></script>
</body>
</html>


Beck-end:

package com.guilhermejt.transportadora.model;


import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.math.BigDecimal;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "viagem")
public class Viagem {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "responsavel")
    private Pessoa responsavel;

    @ManyToOne
    @JoinColumn(name = "transportadora")
    private Empresa transportadora;

    @ManyToOne
    @JoinColumn(name = "motorista_id")
    private Pessoa motorista;

    @ManyToOne
    @JoinColumn(name = "veiculo_id")
    private Veiculo veiculo;

    @ManyToOne
    @JoinColumn(name = "fazenda_origem")
    private Fazenda origem;

    @ManyToOne
    @JoinColumn(name = "fazenda_destino")
    private Fazenda destino;

    private Integer quantidadeAnimais;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataEmbarque;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataDesembarque;

    private Integer km;

    private BigDecimal valorPorKm;

    private BigDecimal valorGastoPedagio;

    private BigDecimal adiantamento;

    private BigDecimal total;

    @ManyToOne
    @JoinColumn(name = "condicao")
    private Condicao condicao;



    public void calcularTotal(){

        BigDecimal valorKm = valorPorKm != null ? valorPorKm : BigDecimal.ZERO;
        BigDecimal kmValue = km != null ? BigDecimal.valueOf(km) : BigDecimal.ZERO;
        BigDecimal pedagio = valorGastoPedagio != null ? valorGastoPedagio : BigDecimal.ZERO;
        BigDecimal adiant = adiantamento != null ? adiantamento : BigDecimal.ZERO;

        this.total = valorKm
                .multiply(kmValue)
                .add(pedagio)
                .subtract(adiant);
    }



}


package com.guilhermejt.transportadora.repository;

import com.guilhermejt.transportadora.model.Viagem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ViagemRepository extends JpaRepository<Viagem, Integer> {

    List<Viagem>  findByDataEmbarqueBetween(LocalDate inicio, LocalDate fim);
}



package com.guilhermejt.transportadora.service;


import com.guilhermejt.transportadora.model.Viagem;
import com.guilhermejt.transportadora.repository.ViagemRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ViagemService {
    private final ViagemRepository repository;

    public ViagemService(ViagemRepository repository) {
        this.repository = repository;
    }

    public Viagem saveViagem(Viagem viagem){
        viagem.calcularTotal();
        return repository.save(viagem);
    }

    public List<Viagem> filtroViagens(LocalDate inicio, LocalDate fim){
        return repository.findByDataEmbarqueBetween(inicio, fim);
    }

    public List<Viagem> getViagens(){
        return repository.findAll();
    }

    public Viagem getViagem(Integer id){
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Viagem não encontrada"));
    }

    public void deleteViagem(Integer id){
        repository.deleteById(id);
    }

    public Viagem updateViagem(Integer id, Viagem dadosNovos){
        Viagem viagem = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Viagem não encontrada"));

        if(dadosNovos.getResponsavel() != null){
            viagem.setResponsavel(dadosNovos.getResponsavel());
        }

        if(dadosNovos.getTransportadora() != null){
            viagem.setTransportadora(dadosNovos.getTransportadora());
        }

        if(dadosNovos.getMotorista() != null){
            viagem.setMotorista(dadosNovos.getMotorista());
        }

        if(dadosNovos.getVeiculo() != null){
            viagem.setVeiculo(dadosNovos.getVeiculo());
        }

        if(dadosNovos.getOrigem() != null){
            viagem.setOrigem(dadosNovos.getOrigem());
        }

        if(dadosNovos.getDestino() != null){
            viagem.setDestino(dadosNovos.getDestino());
        }

        if(dadosNovos.getQuantidadeAnimais() != null) {
            viagem.setQuantidadeAnimais(dadosNovos.getQuantidadeAnimais());
        }

        if(dadosNovos.getDataEmbarque() != null){
            viagem.setDataEmbarque(dadosNovos.getDataEmbarque());
        }

        if(dadosNovos.getDataDesembarque() != null){
            viagem.setDataDesembarque(dadosNovos.getDataDesembarque());
        }

        if(dadosNovos.getKm() != null){
            viagem.setKm(dadosNovos.getKm());
        }

        if(dadosNovos.getValorPorKm() != null){
            viagem.setValorPorKm(dadosNovos.getValorPorKm());
        }

        if(dadosNovos.getValorGastoPedagio() != null){
            viagem.setValorGastoPedagio(dadosNovos.getValorGastoPedagio());
        }

        if(dadosNovos.getAdiantamento() != null){
            viagem.setAdiantamento(dadosNovos.getAdiantamento());
        }

        if(dadosNovos.getCondicao() != null){
            viagem.setCondicao(dadosNovos.getCondicao());
        }
        
        viagem.calcularTotal();

        return repository.save(viagem);
    }
}


package com.guilhermejt.transportadora.controller;


import com.guilhermejt.transportadora.model.Viagem;
import com.guilhermejt.transportadora.service.ViagemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/viagem")
public class ViagemController {
    private final ViagemService service;


    public ViagemController(ViagemService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Viagem> createViagem(@RequestBody Viagem viagem){
        Viagem via = service.saveViagem(viagem);
        return ResponseEntity.ok(via);
    }

    @GetMapping("/filtro")
    public ResponseEntity<List<Viagem>> filtroViagens(@RequestParam LocalDate inicio, @RequestParam LocalDate fim){
        return ResponseEntity.ok(service.filtroViagens(inicio, fim));
    }

    @GetMapping
    public ResponseEntity<List<Viagem>> getViagens(){
        return ResponseEntity.ok(service.getViagens());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Viagem> getViagem(@PathVariable Integer id){
        return ResponseEntity.ok(service.getViagem(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteViagem(@PathVariable Integer id){
        service.deleteViagem(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Viagem> updateViagem(@PathVariable Integer id, @RequestBody Viagem dadosNovos){
        Viagem viagem = service.updateViagem(id, dadosNovos);
        return ResponseEntity.ok(viagem);
    }
}
