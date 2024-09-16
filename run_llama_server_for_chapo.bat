@echo off
setlocal

:: Set the path to the llama-server.exe file and the model file
set LlamaServerPath=%~dp0llama-server.exe
set ModelPath=%~dp0models\gemma-2-2b-it-abliterated-Q4_K_M.gguf

:: Run
start "Chapo x Llama Server (Do not close this window when Chapo is running)" /min %LlamaServerPath% -m %ModelPath%