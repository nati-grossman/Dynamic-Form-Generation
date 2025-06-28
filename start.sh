#!/bin/bash

echo "Starting Dynamic Form Generation System..."
echo

echo "1. Starting Server..."
cd Server
python main.py &
SERVER_PID=$!
cd ..

echo "2. Starting Client..."
cd Client
npm start &
CLIENT_PID=$!
cd ..

echo
echo "System is starting up..."
echo "Server will be available at: http://localhost:8000"
echo "Client will be available at: http://localhost:3000"
echo
echo "Press Ctrl+C to stop both servers"
echo

# Wait for user to stop
trap "echo 'Stopping servers...'; kill $SERVER_PID $CLIENT_PID; exit" INT
wait 