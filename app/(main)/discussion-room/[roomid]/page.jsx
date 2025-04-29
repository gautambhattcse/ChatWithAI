"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/Services/GlobalServices";
import { CoachList } from "@/Services/Options";
import { UserButton } from "@stackframe/stack";
import { RealtimeTranscriber } from "assemblyai";
import { useQuery } from "convex/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
// import RecordRTC from "recordrtc";
const RecordRTC = dynamic(() => import("recordrtc"), { ssr: false });

function DiscussionRoom() {
  const { roomid } = useParams();
  const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, {
    id: roomid,
  });
  const [expert, setExpert] = useState();
  const [connectMic, setConnectMic] = useState(false);
  const [transcribedText, setTranscribedText] = useState();
  const [conversation, setConversation] = useState([]);
  const recorder = useRef(null);
  const realtimeTranscriber = useRef(null);
  let silenceTimeout;
  let texts = {};

  useEffect(() => {
    if (DiscussionRoomData) {
      const Expert = CoachList.find(
        (item) => item.name == DiscussionRoomData.expertName
      );
      console.log(Expert);
      setExpert(Expert);
    }
  }, [DiscussionRoomData]);

  const connectToServer = async () => {
    setConnectMic(true);

    //Initialize Assembly AI
    realtimeTranscriber.current = new RealtimeTranscriber({
      token: await getToken(),
      sample_rate: 16_000,
    });

    realtimeTranscriber.current.on("transcript", async (transcript) => {
      console.log(transcript);
      let msg = "";

      if (transcript.message_type == "FinalTranscript") {
        setConversation((prev) => [
          ...prev,
          {
            role: "user",
            content: transcript.text,
          },
        ]);
      }

      texts[transcript.audio_start] = transcript?.text;
      const keys = Object.keys(texts);
      keys.sort((a, b) => a - b);

      for (const key of keys) {
        if (texts[key]) {
          msg += `${texts[key]}`;
        }
      }

      setTranscribedText(msg);
    });

    await realtimeTranscriber.current.connect();
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })

        .then((stream) => {
          recorder.current = new RecordRTC(stream, {
            type: "audio",

            mimeType: "audio/webm;codecs=pcm",

            recorderType: RecordRTC.StereoAudioRecorder,

            timeSlice: 250,

            desiredSampRate: 16000,

            numberOfAudioChannels: 1,

            bufferSize: 4096,

            audioBitsPerSecond: 128000,

            ondataavailable: async (blob) => {
              if (!realtimeTranscriber.current) return;

              // Reset the silence detection timer on audio input

              clearTimeout(silenceTimeout);

              const buffer = await blob.arrayBuffer();

              //console.log(buffer)
              realtimeTranscriber.current.sendAudio(buffer);

              // Restart the silence detection timer

              silenceTimeout = setTimeout(() => {
                console.log("User stopped talking");

                // Handle user stopped talking (e.g., send final transcript, stop recording, etc.)
              }, 2000);
            },
          });

          recorder.current.startRecording();
        })

        .catch((err) => console.error(err));
    }
  };

  const disconnect = async (e) => {
    e.preventDefault();
    await realtimeTranscriber.current.close();
    recorder.current.pauseRecording();
    recorder.current = null;
    setConnectMic(false);
  };

  return (
    <div className="-mt-12">
      <h2 className="text-lg font-bold">
        {DiscussionRoomData?.coachingOption}
      </h2>
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className=" h-[60vh] bg-secondary border rounded-4xl flex flex-col items-center justify-center relative">
            <Image
              src={expert?.avatar || "/default-user.svg"}
              alt="Avatar"
              width={200}
              height={200}
              className="h-[80px] w-[80px] rounded-full object-cover animate-pulse"
            />
            <h2 className="text-gray-500">{expert?.name}</h2>
            <div className="p-5 bg-gray-200 px-10 rounded-lg absolute bottom-10 right-10">
              <UserButton />
            </div>
          </div>
          <div className="mt-5 flex items-center justify-center">
            {!connectMic ? (
              <Button onClick={connectToServer}>Connect</Button>
            ) : (
              <Button variant="destructive" onClick={disconnect}>
                Disconnect
              </Button>
            )}
          </div>
        </div>
        <div>
          <div className="h-[60vh] bg-secondary border rounded-4xl flex flex-col items-center justify-center relative">
            <h2>Chat Section</h2>
          </div>
          <h2 className="mt-5 text-gray-400 text-sm">
            At the end of your session, we will automatically generate
            feedback/notes from your conversation.
          </h2>
        </div>
      </div>
      <div>
        <h2>{transcribedText}</h2>
      </div>
    </div>
  );
}

export default DiscussionRoom;
