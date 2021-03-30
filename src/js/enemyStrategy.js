/* async enemyAttacks(character, target) {
    await this.characterAttack(character, target);
    this.player = 'user';
  }

  enemyStrategy() {
    if (this.player === 'enemy') {
      // Атакуем игроков user в рамках допустимых значений
      for (const itemEnemy of [...this.enemyPositions]) {
        const allowAttack = allowedValuesAttack(itemEnemy.position,
             this.selectedCharacter.character.distanceAttack, this.gamePlay.boardSize);
        const target = this.enemyAttack(allowAttack);
        if (target !== null) {
          this.enemyAttacks(itemEnemy.character, target);
          return;
        }
      }

      // Двигаемся случайным игроком
      const randomIndex = Math.floor(Math.random() * [...this.enemyPositions].length);
      const randomEnemy = [...this.enemyPositions][randomIndex];
      this.enemyMove(randomEnemy);
      this.gamePlay.redrawPositions([...this.userPositions, ...this.enemyPositions]);
      this.player = 'user';
    }
  }

  enemyMove(itemEnemy) {
    const tempEnemy = itemEnemy;
    const itemEnemyDistance = itemEnemy.character.distance;
    let tempRow;
    let tempColumn;
    let stepRow;
    let stepColumn;
    let Steps;
    const itemEnemyRow = this.positionRow(tempEnemy.position);
    const itemEnemyColumn = this.positionColumn(tempEnemy.position);
    let nearUser = {};

    for (const itemUser of [...this.userPositions]) {
      const itemUserRow = this.positionRow(itemUser.position);
      const itemUserColumn = this.positionColumn(itemUser.position);
      stepRow = itemEnemyRow - itemUserRow;
      stepColumn = itemEnemyColumn - itemUserColumn;
      Steps = Math.abs(stepRow) + Math.abs(stepColumn);

      if (nearUser.steps === undefined || Steps < nearUser.steps) {
        nearUser = {
          steprow: stepRow,
          stepcolumn: stepColumn,
          steps: Steps,
          positionRow: itemUserRow,
          positionColumn: itemUserColumn,
        };
      }
    }

    // Движение по диагонали
    if (Math.abs(nearUser.steprow) === Math.abs(nearUser.stepcolumn)) {
      if (Math.abs(nearUser.steprow) > itemEnemyDistance) {
        tempRow = (itemEnemyRow - (itemEnemyDistance * Math.sign(nearUser.steprow)));
        tempColumn = (itemEnemyColumn - (itemEnemyDistance * Math.sign(nearUser.stepcolumn)));

        tempEnemy.position = this.rowColumnToIndex(tempRow, tempColumn);
      } else {
        tempRow = (itemEnemyRow - (nearUser.steprow - (1 * Math.sign(nearUser.steprow))));
        tempColumn = (itemEnemyColumn - (nearUser.stepcolumn - (1 * Math.sign(nearUser.steprow))));

        tempEnemy.position = this.rowColumnToIndex(tempRow, tempColumn);
      }
    } else if (nearUser.stepcolumn === 0) {
      // Движение по вертикали
      if (Math.abs(nearUser.steprow) > itemEnemyDistance) {
        tempRow = (itemEnemyRow - (itemEnemyDistance * Math.sign(nearUser.steprow)));

        tempEnemy.position = this.rowColumnToIndex(tempRow, (itemEnemyColumn));
      } else {
        tempRow = (itemEnemyRow - (nearUser.steprow - (1 * Math.sign(nearUser.steprow))));

        tempEnemy.position = this.rowColumnToIndex(tempRow, (itemEnemyColumn));
      }
    } else if (nearUser.steprow === 0) {
      if (Math.abs(nearUser.stepcolumn) > itemEnemyDistance) {
        tempColumn = (itemEnemyColumn - (itemEnemyDistance * Math.sign(nearUser.stepcolumn)));

        tempEnemy.position = this.rowColumnToIndex((itemEnemyRow), tempColumn);
      } else {
        const tempFormul = (nearUser.stepcolumn - (1 * Math.sign(nearUser.stepcolumn)));
        tempColumn = (itemEnemyColumn - tempFormul);

        tempEnemy.position = this.rowColumnToIndex((itemEnemyRow), tempColumn);
      }
    } else if (Math.abs(nearUser.steprow) > Math.abs(nearUser.stepcolumn)) {
      if (Math.abs(nearUser.steprow) > itemEnemyDistance) {
        tempRow = (itemEnemyRow - (itemEnemyDistance * Math.sign(nearUser.steprow)));

        tempEnemy.position = this.rowColumnToIndex(tempRow, (itemEnemyColumn));
      } else {
        tempRow = (itemEnemyRow - (nearUser.steprow));

        tempEnemy.position = this.rowColumnToIndex(tempRow, (itemEnemyColumn));
      }
    } else if (Math.abs(nearUser.stepcolumn) > itemEnemyDistance) {
      tempColumn = (itemEnemyColumn - (itemEnemyDistance * Math.sign(nearUser.stepcolumn)));

      tempEnemy.position = this.rowColumnToIndex((itemEnemyRow), tempColumn);
    } else {
      tempEnemy.position = this.rowColumnToIndex((itemEnemyRow), (itemEnemyColumn));
    }
  }

  positionRow(index) {
    return Math.floor(index / this.gamePlay.boardSize);
  }

  positionColumn(index) {
    return index % this.gamePlay.boardSize;
  }

  rowColumnToIndex(row, column) {
    return (row * 8) + column;
  }

  enemyAttack(allowAttack) {
    for (const itemUser of [...this.userPositions]) {
      if (allowAttack.includes(itemUser.position)) {
        return itemUser;
      }
    }
    return null;
  }
  */
