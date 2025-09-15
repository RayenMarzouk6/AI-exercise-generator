// Updated Generate.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import {
  Box,
  Container,
  TextField,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  Paper,
  Divider,
  Grid,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

// Configuration de Supabase
const SUPABASE_URL = "";
const SUPABASE_KEY = "";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const Generate = () => {
  const [subject, setSubject] = useState("");
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const COHERE_API_KEY = "";
  const API_URL = "https://api.cohere.ai/v1/generate";

  useEffect(() => {
    const fetchExercises = async () => {
      const { data, error } = await supabase
        .from("exercices")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erreur lors du chargement des exercices :", error);
        setError("Erreur lors du chargement des exercices.");
      } else {
        setExercises(data);
      }
    };

    fetchExercises();
  }, []);

  const saveExercise = async (exercise) => {
    const { data, error } = await supabase
      .from("exercices")
      .insert([{ ...exercise, category: subject }])
      .select();

    if (error) {
      console.error("Erreur lors de l'ajout de l'exercice :", error);
      setError("Erreur lors de l'ajout de l'exercice.");
    } else {
      setExercises((prev) => [data[0], ...prev]);
    }
  };

  const generateExercises = async () => {
    if (!subject.trim()) {
      setError("Veuillez entrer un sujet.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const prompt = `
        Génère 3 exercices sur le sujet suivant : ${subject}.
        Pour chaque exercice, utilise la structure suivante :
        1. Titre: [Titre de l'exercice]
          Énoncé: [Énoncé de l'exercice]
          Correction: [Correction étape par étape]
        Assure-toi que les exercices sont clairs, détaillés et adaptés à un niveau débutant.
        `;

      const response = await axios.post(
        API_URL,
        {
          model: "command",
          prompt: prompt,
          max_tokens: 300,
          temperature: 0.5,
          top_p: 0.8,
        },
        {
          headers: {
            Authorization: `Bearer ${COHERE_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const generatedText = response.data.generations[0].text;
      const exercisesList = generatedText
        .split(/\d+\./)
        .filter((exercise) => {
          const hasTitle = exercise.includes("Titre:");
          const hasStatement = exercise.includes("Énoncé:");
          const hasCorrection = exercise.includes("Correction:");
          return hasTitle && hasStatement && hasCorrection;
        })
        .map((exercise) => {
          const title = exercise.match(/Titre: (.*)/)?.[1] || "Sans titre";
          const statement = exercise.match(/Énoncé: (.*)/)?.[1] || "Sans énoncé";
          const correction = exercise.match(/Correction: (.*)/s)?.[1] || "Sans correction";
          return { titre: title, enonce: statement, correction, category: subject };
        });

      if (exercisesList.length === 0) {
        setError("Aucun exercice trouvé dans la réponse. Veuillez réessayer.");
        return;
      }

      for (const exercise of exercisesList) {
        await saveExercise(exercise);
      }
    } catch (error) {
      console.error("Erreur lors de la requête à l'API Cohere :", error);
      if (error.response) {
        switch (error.response.status) {
          case 401:
            setError("Clé API incorrecte ou manquante.");
            break;
          case 429:
            setError("Vous avez dépassé la limite de requêtes.");
            break;
          default:
            setError("Une erreur s'est produite. Veuillez réessayer.");
        }
      } else {
        setError("Problème de connexion. Veuillez vérifier votre réseau.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const deleteExercise = async (id) => {
    const { error } = await supabase
      .from("exercices")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erreur lors de la suppression de l'exercice :", error);
      setError("Erreur lors de la suppression de l'exercice.");
    } else {
      setExercises((prev) => prev.filter((exercise) => exercise.id !== id));
    }
  };

  return (
    <Container maxWidth="md">
      <Box py={4}>
        <Typography variant="h4" align="center" gutterBottom>
          Générateur Automatique d'Exercices
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Sujet"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Entrez un sujet (ex: mathématiques, histoire...)"
            fullWidth
            variant="outlined"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={generateExercises}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Générer des exercices"}
          </Button>
          {error && <Typography color="error">{error}</Typography>}
        </Box>
      </Box>

      <Paper elevation={3} sx={{ mt: 4, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Exercices générés :
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {exercises.map((exercise) => (
            <Grid item xs={12} md={6} key={exercise.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {exercise.titre}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Énoncé :</strong> {exercise.enonce}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Correction :</strong> {exercise.correction}
                  </Typography>
                  <Typography variant="caption" display="block" mt={1}>
                    <strong>Catégorie :</strong> {exercise.category}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    onClick={() => deleteExercise(exercise.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default Generate;
