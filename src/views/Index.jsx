import { Container, Row, Col, InputGroup, InputGroupText, Input } from "reactstrap"
import axios from "axios"
import {useState, useEffect} from "react"
import PokeTarjeta from "../components/PokeTarjeta"

const Index = () => {
  const [pokemons, setPokemons] = useState([]);
  const [offset, setOffset] = useState(0);
  const [limite, setLimite] = useState(20);

  useEffect(() => {
    getPokemons(offset);
  },[])

  const getPokemons = async(o) => {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limite}&offset=${offset}`;
    axios.get(url).then(async(response) => {
      const respuesta = response.data;
      setPokemons(respuesta.results);
    })
  }

  return (
    <div>
      <Container className="shadow bg-danget mt-3">
        <Row>
          <Col>
            <InputGroup className="mt-3 mb-3 shadow">
              <InputGroupText><i className="fa-solid fa-search"></i></InputGroupText>
              <Input placeholder="Buscar Pokemon"></Input>
            </InputGroup>
          </Col>
        </Row>
        <Row className="mt-3">
          { pokemons.map( (pok, i) => (
            <PokeTarjeta poke={pok} key={i}></PokeTarjeta>
          )) }
        </Row>
      </Container>
    </div>
  )
}

export default Index
