import { quests } from "../data";
import { Quest, QuestProgress } from "../types";
import { Checkmark } from "./checkmark";

type Props = {
  quest: Quest;
  questProgress: QuestProgress;
  setQuestProgress(questProgress: QuestProgress): void;
  showCompleted: boolean;
};

export const QuestListing = ({
  quest,
  questProgress,
  setQuestProgress,
  showCompleted,
}: Props) => {
  const maxQuest = (e: React.MouseEvent, questName: string) => {
    e.preventDefault();
    const quest = quests.find((quest) => quest.name === questName);
    if (quest) {
      handleQuestPartChange(quest.parts.length);
    }
  };

  const handleQuestPartChange = (partNumber: number) => {
    const questProgressCopy = { ...questProgress };

    questProgressCopy[quest.name] = partNumber;

    setQuestProgress(questProgressCopy);
  };

  const questCompleted = (): boolean => {
    return (
      questProgress[quest.name] ===
      quests.find((q) => q.name === quest.name)?.parts.length
    );
  };

  const partCompleted = (partNumber: number): boolean => {
    return questProgress[quest.name] > partNumber;
  };

  if (questCompleted() && !showCompleted) {
    return null;
  }

  return (
    <div className={`quest-listing ${quest.campaign.toLocaleLowerCase()}`}>
      <details>
        <summary>
          <h4>
            {questCompleted() ? (
              <Checkmark offsetTop={-40} offsetLeft={-50} fontSize={32} />
            ) : null}
            {quest.name}
          </h4>
          <br />
          <div className="inline-flex">
            <span>Parts completed: </span>
            <button
              onClick={() => handleQuestPartChange(0)}
              disabled={questProgress[quest.name] === 0}
            >
              ⏪
            </button>
            <button
              onClick={() =>
                handleQuestPartChange(questProgress[quest.name] - 1)
              }
              disabled={questProgress[quest.name] === 0}
            >
              ➖
            </button>
            <span className="upgrade-level">{questProgress[quest.name]}</span>
            <button
              onClick={() =>
                handleQuestPartChange(questProgress[quest.name] + 1)
              }
              disabled={questCompleted()}
            >
              ➕
            </button>
            <button
              onClick={(e) => maxQuest(e, quest.name)}
              disabled={questCompleted()}
            >
              ⏩
            </button>
          </div>
        </summary>
        <br />
        {quest.parts.map(
          (part, i) =>
            (!partCompleted(i) || showCompleted) && (
              <div key={quest.name + i}>
                Part {i + 1}:
                <ul>
                  {part.description && (
                    <li>
                      {partCompleted(i) ? (
                        <Checkmark
                          offsetLeft={-24}
                          offsetTop={0}
                          fontSize={16}
                        />
                      ) : null}
                      {part.description}
                    </li>
                  )}
                  {part.deliverItems &&
                    part.deliverItems.map((item, j) => (
                      <li key={`${quest.name}${item.item}${j}`}>
                        {partCompleted(i) ? (
                          <Checkmark
                            offsetLeft={-24}
                            offsetTop={0}
                            fontSize={16}
                          />
                        ) : null}
                        Deliver {item.quantity} {item.item}
                      </li>
                    ))}
                  {part.dropItems &&
                    part.dropItems.map((item, j) => (
                      <li key={`${quest.name}${item.item}${j}`}>
                        {partCompleted(i) ? (
                          <Checkmark
                            offsetLeft={-24}
                            offsetTop={0}
                            fontSize={16}
                          />
                        ) : null}
                        Drop {item.quantity} {item.item} at {item.dropLocation}
                      </li>
                    ))}
                </ul>
              </div>
            )
        )}
      </details>
    </div>
  );
};
