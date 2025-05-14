import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Button, InputGroup, FormControl, Container, Row, Col, Alert } from "react-bootstrap";

export const MusicPlayer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [songs, setSongs] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [message, setMessage] = useState(null);

  const searchSongs = async () => {
    if (!searchTerm) return;

    setMessage(null);
    setSongs([]);
    setCurrentTrackIndex(null);

    try {
      const res = await fetch(`https://deezerdevs-deezer.p.rapidapi.com/search?q=${searchTerm}`, {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": "114de5d25emshfc6913eeed5ad1ap13adb8jsn304140b92f5d",
          "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com"
        }
      });

      const data = await res.json();
      const results = Array.isArray(data.data) ? data.data : [];

      setSongs(results);
      if (results.length === 0) setMessage("No results found.");
    } catch (err) {
      console.error("Search error:", err);
      setMessage("Failed to fetch songs. Please try again.");
    }
  };

  const handlePrev = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentTrackIndex < songs.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    }
  };

  const currentTrack = currentTrackIndex !== null ? songs[currentTrackIndex] : null;

  return (
    <Container className="py-5 main-container">
      <h2 className="text-center mb-4 heading">Music Player ❤🎧</h2>

      <InputGroup className="mb-4">
        <FormControl
          placeholder="Search for a song..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchSongs()}
        />
        <Button variant="primary" onClick={searchSongs}>
          Search
        </Button>
      </InputGroup>

      {message && <Alert variant="warning">{message}</Alert>}

      <Row>
        {songs.map((song, index) => (
          <Col key={song.id} md={4} xs={6} className="mb-4">
            <Card className="main-card">
              <Card.Img variant="top" src={song.album.cover_medium} />
              <Card.Body>
                <Card.Title>{song.title}</Card.Title>
                <Card.Text>{song.artist.name}</Card.Text>
                <Button
                  variant="success"
                  onClick={() => setCurrentTrackIndex(index)}
                >
                  Play Preview
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {currentTrack && (
        <Container fluid className="p-3 shadow text-white current-song-container">
          <Row className="justify-content-center current-song-row">
            <Col md={4} xs={10}>
              <Card>
                <Card.Img variant="top" src={currentTrack.album.cover_medium} />
                <Card.Body>
                  <Card.Title>{currentTrack.title}</Card.Title>
                  <Card.Text>{currentTrack.artist.name}</Card.Text>
                  <audio
                    controls
                    autoPlay
                    src={currentTrack.preview}
                    className="w-100"
                  />
                  <div className="d-flex justify-content-between mt-3">
                    <Button
                     className="song-button"
                      onClick={handlePrev}
                      disabled={currentTrackIndex === 0}
                    >
                      ⏮ 
                    </Button>
                    <Button
                      className="song-button next-button"
                      onClick={handleNext}
                      disabled={currentTrackIndex === songs.length - 1}
                    >
                       ⏭
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => setCurrentTrackIndex(null)}
                    >
                      ✖ Close  
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      )}
    </Container>
  );
};
