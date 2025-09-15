import { createClient } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";

const AllExercice = () => {
  const SUPABASE_URL = "https://url.supabase.co";
  const SUPABASE_KEY = "key";
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const [exercices, setExercices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("exercices")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erreur lors du chargement des exercices :", error);
      } else {
        setExercices(data);
        const uniqueCategories = [...new Set(data.map((ex) => ex.category))];
        setCategories(uniqueCategories);
      }
      setLoading(false);
    };

    fetchExercises();
  }, []);

  const filteredExercises = selectedCategory
    ? exercices.filter((ex) => ex.category === selectedCategory)
    : exercices;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          color: "#1976D2",
          fontWeight: "bold",
        }}
      >
        Tous les Exercices
      </Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <FormControl sx={{ width: "40%" }}>
          <InputLabel id="category-filter-label">Filtrer par catégorie</InputLabel>
          <Select
            labelId="category-filter-label"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <MenuItem value="">Toutes les catégories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/generate"
          sx={{
            backgroundColor: "#1976D2",
            "&:hover": { backgroundColor: "#115293" },
          }}
        >
          Générer un nouvel exercice
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          {filteredExercises.map((exercise) => (
            <Card key={exercise.id} sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {exercise.titre}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {exercise.enonce}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mt: 2,
                    color: "#1976D2",
                  }}
                >
                  <strong>Correction :</strong> {exercise.correction}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  <strong>Catégorie :</strong> {exercise.category}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  Voir plus
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default AllExercice;
