import { Container, Row, Col, InputGroup, InputGroupText, Input, Button} from "reactstrap"
import { PaginationControl } from 'react-bootstrap-pagination-control';
import axios from "axios"
import {useState, useEffect} from "react"
import PokeTarjeta from "../components/PokeTarjeta"

const Index = () => {
  const [pokemons, setPokemons] = useState([]);
  const [allPokemons, setAllPokemons] = useState([]);
  const [listado, setListado] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [offset, setOffset] = useState(0);
  const [limite, setLimite] = useState(20);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getPokemons(offset)
    getAllPokemons()
  },[])

  const getPokemons = async(o) => {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limite}&offset=${o}`;
    axios.get(url).then(async(response) => {
      const respuesta = response.data;
      setPokemons(respuesta.results);
      setListado(respuesta.results);
      setTotal(respuesta.count);
    })
  }

  const getAllPokemons = async(o) => {
    const url = 'https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0';
    axios.get(url).then(async(response) => {
      const respuesta = response.data;
      setAllPokemons(respuesta.results);
    })
  }

  const buscar = async(e) => {
    if(e.keyCode == 13) {
      if(filtro.trim() != '') {
        setListado([]);
        setTimeout(() => {
          setListado(allPokemons.filter(p => p.name.includes(filtro)))
        },100)
      } else if(filtro.trim() == '') {
        setListado([]);
        setTimeout(() => {
          setListado(pokemons)
        },100)
      }
    }
  }

  const limpiarBusqueda = () => {
    setFiltro('');
    setListado([]);
    setTimeout(() => {
      setListado(pokemons);
    }, 100);
  }

  const goPage = async(p) => {
    setListado([]);
    const newOffset = (p - 1) * limite;
    await getPokemons(newOffset);
    setOffset(newOffset);
    setPage(p);
  }

  return (
    <div>
      <Container className="shadow bg-danget mt-3">
        <Row className="justify-content-center">
          <Col xs="12">
            <InputGroup className="mt-4 mb-4 shadow">
              <InputGroupText className="bg-white border-end-0 border-secondary">
                <i className="fa-solid fa-search text-muted"></i>
              </InputGroupText>
              <Input 
                value={filtro} 
                onChange={(e) => {setFiltro(e.target.value)}}
                onKeyUpCapture={buscar}
                placeholder="Buscar Pokémon..."
                className={`border-start-0 border-secondary search-input ${filtro ? 'border-end-0' : ''}`}
              />
              {filtro && (
                <Button color="light" className="border border-start-0 bg-white border-secondary" onClick={limpiarBusqueda}>
                    <i className="fa-solid fa-xmark text-muted"></i>
                </Button>
              )}
            </InputGroup>
          </Col>
        </Row>
        <Row className="mt-3">
          { listado.map( (pok, i) => (
            <PokeTarjeta poke={pok} key={i}></PokeTarjeta>
          )) }
          <PaginationControl last={true} limit={limite} total={total} page={page} changePage={page => goPage(page)} />
        </Row>
      </Container>
    </div>
  )
}

export default Index
