"use client";

import React, { useState } from "react";
import { Button } from "@heroui/react";

import {
  AnalysisProgress,
  AnalysisResultCard,
  BpmRangeSelector,
} from "../components/SongAnalyzer";

import FileUploadField from "../components/Upload/FileUploadField";
import FormMessage from "../components/Upload/FormMessage";
import UploadIcon from "../components/Icons/UploadIcon";

import { analyzeAudio } from "../services/audioService";
import withAuth from "../hoc/withAuth";
import { ALLOWED_AUDIO_TYPES } from "../utils/fileTypes";

import { isAudioFile } from "../components/SongAnalyzer/utils";

function SongAnalyzerPage() {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [bpmRange, setBpmRange] = useState("50-100");

  function handleFileChange(event) {
    const selectedFile = event.target.files?.[0];

    setError(null);
    setResults(null);

    if (!selectedFile) return;

    if (!isAudioFile(selectedFile, ALLOWED_AUDIO_TYPES)) {
      setError("Please select a valid audio file.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  }

  function removeFile() {
    setFile(null);
    setResults(null);
    setError(null);
  }

  async function analyzeSong() {
    if (!file) {
      setError("Please select an audio file first.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResults(null);
    setUploadProgress(0);
    setAnalysisProgress(0);

    try {
      const analysisResults = await analyzeAudio(
        file,
        bpmRange,
        setUploadProgress,
        setAnalysisProgress,
      );

      setResults(analysisResults);
    } catch (error) {
      setError(error?.message || "Something went wrong during analysis.");
    } finally {
      setIsAnalyzing(false);
      setUploadProgress(0);
      setAnalysisProgress(0);
    }
  }

  return (
    <main className="text-foreground mx-auto max-w-5xl p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <section className="border-accent bg-secondary shadow-card w-full max-w-xl space-y-6 rounded-lg border-2 p-6">
          <BpmRangeSelector
            bpmRange={bpmRange}
            setBpmRange={setBpmRange}
            isDisabled={isAnalyzing}
          />

          <FileUploadField
            type="track"
            file={file}
            label="Select Audio File"
            allowedTypes={ALLOWED_AUDIO_TYPES}
            icon={<UploadIcon className="size-6" />}
            onFileChange={handleFileChange}
            onRemove={removeFile}
            isDisabled={isAnalyzing}
          />

          <AnalysisProgress
            uploadProgress={uploadProgress}
            analysisProgress={analysisProgress}
          />

          <FormMessage type="error">{error}</FormMessage>

          <Button
            color="primary"
            type="button"
            onClick={analyzeSong}
            isLoading={isAnalyzing}
            isDisabled={!file || isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Song"}
          </Button>
        </section>

        <AnalysisResultCard results={results} />
      </div>
    </main>
  );
}

export default withAuth(SongAnalyzerPage);
