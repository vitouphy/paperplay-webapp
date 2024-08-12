"use client";

import { useState } from "react";
import { Scene } from "./common";
import { SceneComponent } from "./components/Scene";
import { generateRandomSceneSetup, generateScene } from "@/app/api/chat";
import { EmptySetup } from "./components/EmptySetup";
import { getEntireStory } from "./utils";
import MarkdownIt from "markdown-it";
import parse from "html-react-parser";

export default function Page() {
  const [activeSceneId, setActiveSceneId] = useState(0);
  const [exportContent, setExportContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [scenes, setScenes] = useState<Scene[]>([]);

  return (
    <div className="flex h-screen">
      <div className="bg-gray-800 text-white w-64 hidden lg:block">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Your App</h2>
        </div>
        <ul className="space-y-2">
          <li>
            <a href="#" className="block pl-6 py-2 hover:bg-gray-700">
              Dashboard
            </a>
          </li>
        </ul>
      </div>

      <div className="flex-1 h-screen overflow-y-auto relative">
        <div className="m-14">
          <div>
            <h1 className="text-2xl font-bold mb-4">Story</h1>
          </div>
          {scenes.length == 0 && (
            <EmptySetup
              onGenerateSetup={async () => {
                const setup = await generateRandomSceneSetup();
                setScenes([{ setup, isAutomated: false, isDone: false }]);
              }}
            />
          )}
          {scenes.length > 1 && (
            <button
              className="btn btn-primary btn-outline mb-6"
              onClick={() => {
                // Build MD output
                let parts = [];
                for (let i = 0; i < scenes.length; i++) {
                  const scene = scenes[i];
                  parts.push(
                    ...[`## Scene ${i + 1}\n\n`, scene.content, "\n\n"]
                  );
                }

                const content = parts.join("");

                const md = new MarkdownIt();
                const html = md.render(content);
                setExportContent(html);

                document.getElementById("my_modal_2").showModal();
              }}
            >
              Export
            </button>
          )}
          <dialog id="my_modal_2" className="modal">
            <div className="modal-box">
              {/* <h3 className="font-bold text-lg">Story</h3> */}
              {/* {exportContent && <Markdown>{parse(exportContent)}</Markdown>} */}
              <div className="export-container">{parse(exportContent)}</div>
              {/* <div className="export-container">{parse("<h1>Hello</h1>")}</div> */}
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
           
          <div role="tablist" className="tabs tabs-bordered w-full">
            {scenes.map((scene, index) => (
              <>
                <input
                  type="radio"
                  name={`radio-${index}`}
                  className="radio radio-primary"
                  checked={index == activeSceneId}
                  onClick={() => setActiveSceneId(index)}
                />
                <div
                  role="tabpanel"
                  className="tab-content p-10"
                  key={`tab-content-${index}`}
                  style={{
                    display: activeSceneId === index ? "block" : "none",
                  }}
                >
                  <SceneComponent
                    key={`scene-${index}`}
                    scene={scene}
                    scenes={scenes}
                    onUpdateScene={(updatedScene) => {
                      const newList = scenes.map((originalScene, idx) =>
                        idx === index ? updatedScene : originalScene
                      );
                      setScenes(newList);
                    }}
                    onAddScene={async (newScene) => {
                      setLoading(true);
                      // this also signals done because we add a new scene when we complete with the curernt scene
                      scene.isDone = true;

                      if (newScene.isAutomated) {
                        // Automate the next scene by AI
                        const newSceneStory = await generateScene(
                          newScene.setup,
                          getEntireStory(scenes)
                        );
                        newScene.isAutomated = true;
                        newScene.content = newSceneStory;
                        newScene.isDone = true;

                        // Need to prepare for subsequent scene back to users
                        const newUserScene: Scene = {
                          setup: await generateRandomSceneSetup(
                            getEntireStory([...scenes, newScene])
                          ),
                          isAutomated: false,
                          isDone: false,
                        };
                        setScenes([...scenes, newScene, newUserScene]);
                        setLoading(false);
                      }
                    }}
                  />
                </div>
              </>
            ))}
          </div>
          <div className="pl-10">
            {loading && (
              <span className="loading loading-dots loading-lg bg-primary"></span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
